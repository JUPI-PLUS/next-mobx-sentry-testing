import { AUTH_LOCAL_STORAGE_KEYS } from "../constants/auth";
import { limsClient, limsImageHostClient } from "../../api/config";
import { AxiosHeaders, AxiosRequestConfig, RawAxiosRequestHeaders } from "axios";
import base64url from "base64url";
import UserStore from "../store/UserStore";
import { CurrentAccess, RequiredAccess } from "../models/permissions";

export const setAuthToken = (accessToken: string) => {
    window.localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    limsClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
    limsImageHostClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
};

export const removeAuthToken = () => {
    window.localStorage.removeItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN);
    delete limsClient.defaults.headers.common.Authorization;
    delete limsImageHostClient.defaults.headers.common.Authorization;
};

export const removeAuthTokenFromAxiosConfig = (config: AxiosRequestConfig) => {
    const headers = config.headers as RawAxiosRequestHeaders;
    if (headers) {
        if (headers.Authorization) {
            delete headers.Authorization;
            return;
        }

        if ((headers.common as AxiosHeaders)?.has("Authorization")) {
            (headers.common as AxiosHeaders).delete("Authorization");
        }
    }
};

export const setAuthTokenToOriginalRequest = (config: AxiosRequestConfig, accessToken: string) => {
    const headers = config.headers as RawAxiosRequestHeaders;
    if (headers?.common) {
        (headers.common as AxiosHeaders).set("Authorization", `Bearer ${accessToken}`);
        return;
    }

    if (headers) {
        headers.Authorization = `Bearer ${accessToken}`;
    }
};

export const setAuthTokenToAxiosLocalizeClient = (token: string | null) => {
    if (token === null) return;
    limsClient.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const setPermissionsFromDecodedAuthToken = (token: string | null) => {
    const splittedToken = token && token.split(".");
    if (splittedToken && splittedToken.length === 3) {
        //getting array of permissions from payload
        const tokenPayload = splittedToken[1];
        const decodedParsedPayload = JSON.parse(base64url.decode(tokenPayload));

        UserStore.setupPermissions(decodedParsedPayload.permissions ?? []);
    } else {
        UserStore.setupPermissions([]);
    }
};

export const isAccessAllowed = (currentAccess: CurrentAccess, requiredAccess: RequiredAccess, tolerant?: boolean) => {
    if (Array.isArray(requiredAccess)) {
        return requiredAccess[tolerant ? "some" : "every"](it => currentAccess?.includes(it));
    } else {
        return currentAccess?.includes(requiredAccess);
    }
};
