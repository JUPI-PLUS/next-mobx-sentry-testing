//  libs
import axios, { AxiosError, AxiosPromise, AxiosRequestConfig } from "axios";
import Router from "next/router";

//  store
import AuthStore from "../store/AuthStore";

//  class
import { RequestQueue } from "../classes/requestQueue";

//  helpers
import { refreshToken } from "../../api/users";
import { limsClient } from "../../api/config";
import { removeAuthToken, removeAuthTokenFromAxiosConfig, setAuthTokenToOriginalRequest } from "./auth";
import { showErrorToast } from "../../components/uiKit/Toast/helpers";
import { captureException } from "@sentry/nextjs";

//  models
import { ResponseStatuses } from "../models/axios";

//  constants
import { ROUTES } from "../constants/routes";
import { AUTH_LOCAL_STORAGE_KEYS } from "../constants/auth";
import { USERS_ENDPOINTS } from "../../api/users/endpoints";

let refreshTokenPromise: Promise<string> | null = null;

export const onFailedRefresh = async (error: AxiosError) => {
    removeAuthToken();
    AuthStore.setMemorizedRoute(`${window.location.pathname}${window.location.search}${window.location.hash}`);
    await AuthStore.logout(true);
    await Router.replace(ROUTES.login.route);
    return Promise.reject(error);
};

export const onForbidden = async (error: AxiosError) => {
    await Router.replace(ROUTES.errors.forbidden.route);
    return Promise.reject(error);
};

export const onNotFound = async (error: AxiosError) => {
    await Router.replace(ROUTES.errors.notFound.route);
    return Promise.reject(error);
};

export const handleApiErrorResponse =
    (requestQueue: RequestQueue) =>
    async (error: AxiosError): Promise<AxiosPromise | AxiosError | void> => {
        if (error && !error.isAxiosError) {
            return Promise.reject(error);
        }

        const axiosConfig = error.config as AxiosRequestConfig & { isRetry: boolean };
        const status = error.response?.status || ResponseStatuses.NOT_EXECUTABLE_CONTENT;

        if (!refreshTokenPromise && status === ResponseStatuses.UNAUTHORIZED && !axiosConfig.isRetry) {
            const currentToken = window.localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
            let nextAccessToken: string | undefined;

            if (!currentToken) {
                return Promise.reject(error);
            }

            refreshTokenPromise = new Promise<string>((resolve, reject) => {
                refreshToken()
                    .then(refreshTokenResponse => {
                        nextAccessToken = refreshTokenResponse.data.access_token;
                        AuthStore.setAccessToken(nextAccessToken);
                        refreshTokenPromise = null;
                        requestQueue.execute(nextAccessToken);
                        resolve(nextAccessToken);
                    })
                    .catch(() => {
                        refreshTokenPromise = null;
                        onFailedRefresh(error).catch(() => reject());
                        reject("Unauthorized");
                    });
            });

            return refreshTokenPromise.then(token => {
                const originalRequest = axiosConfig;
                originalRequest.isRetry = true;
                removeAuthTokenFromAxiosConfig(originalRequest);
                setAuthTokenToOriginalRequest(originalRequest, token!);

                return axios(originalRequest).catch(requestError => {
                    const requestConfig = requestError.config;
                    requestConfig.isRetry = false;
                    throw requestError;
                });
            });
        }

        if (status === ResponseStatuses.UNAUTHORIZED && axiosConfig.url === USERS_ENDPOINTS.refresh()) {
            return Promise.reject(error);
        }

        if (status === ResponseStatuses.UNAUTHORIZED && refreshTokenPromise) {
            return new Promise((resolve, reject) => {
                requestQueue.add(axiosConfig, resolve, reject);
            });
        }

        if (status === ResponseStatuses.FORBIDDEN) {
            return onForbidden(error);
        }

        if (status === ResponseStatuses.NOT_FOUND) {
            captureException(error);
            return onNotFound(error);
        }

        if (status === ResponseStatuses.SERVER_ERROR) {
            captureException(error);
            showErrorToast({ title: "Internal server error", message: "Something went wrong" });
            return Promise.reject(error);
        }

        return Promise.reject(error);
    };

export const injectAxiosInterceptors = () => {
    const requestQueue = new RequestQueue();
    limsClient.interceptors.response.use(response => response, handleApiErrorResponse(requestQueue));
};
