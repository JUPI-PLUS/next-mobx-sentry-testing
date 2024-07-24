// libs
import Router from "next/router";
import axios, { AxiosError } from "axios";

// api
import { logout, refreshToken } from "../../../api/users";

// stores
import AuthStore from "../../store/AuthStore";

// helpers
import { removeAuthToken, removeAuthTokenFromAxiosConfig, setAuthToken, setAuthTokenToOriginalRequest } from "../auth";
import { mockFunction, rejectServerResponse, resolveServerResponse } from "../../../testingInfrustructure/utils";
import { handleApiErrorResponse, onFailedRefresh, onForbidden, onNotFound } from "../interceptors";
import { showErrorToast } from "../../../components/uiKit/Toast/helpers";
import { RequestQueue } from "../../classes/requestQueue";
import { defineLocationProps } from "../../../testingInfrustructure/helpers";

// constants
import { ROUTES } from "../../constants/routes";
import { AUTH_LOCAL_STORAGE_KEYS } from "../../constants/auth";

jest.mock("../auth");
jest.mock("axios");
jest.mock("../../../api/users");
jest.mock("../clearQueriesLogout");
jest.mock("../../../components/uiKit/Toast/helpers");
jest.mock("next/router", () => ({ replace: jest.fn().mockResolvedValue({}) }));

const MOCKED_REFRESH_TOKEN = mockFunction(refreshToken);
const MOCKED_REMOVE_AUTH_TOKEN = mockFunction(removeAuthToken);
const MOCKED_SET_AUTH_TOKEN = mockFunction(setAuthToken);
const MOCKED_REMOVE_AUTH_TOKEN_FROM_AXIOS_CONFIG = mockFunction(removeAuthTokenFromAxiosConfig);
const MOCKED_SET_AUTH_TOKEN_TO_ORIGINAL_REQUEST = mockFunction(setAuthTokenToOriginalRequest);
const MOCKED_SHOW_ERROR_TOAST = mockFunction(showErrorToast);
const MOCKED_LOGOUT_REQUEST = mockFunction(logout);
const MOCKED_AXIOS = mockFunction(axios);

// @ts-ignore
const mockAxiosError = (status?: number) =>
    // @ts-ignore
    ({ isAxiosError: true, response: { status }, config: { isRetry: false } } as AxiosError);

const handleApiErrorResponseWithQueue = async (error: AxiosError) => {
    const requestQueue = new RequestQueue();
    await handleApiErrorResponse(requestQueue)(error);
};

describe("interceptors", () => {
    beforeAll(() => {
        resolveServerResponse(MOCKED_LOGOUT_REQUEST, {});
    });

    describe("onFailedRefresh util", () => {
        it("Should remove auth token from local storage and axios instance", async () => {
            const error = {} as AxiosError;
            try {
                await onFailedRefresh(error);
            } catch (e) {
                expect(e).toEqual(error);
            }

            expect(MOCKED_REMOVE_AUTH_TOKEN).toHaveBeenCalled();
        });

        it.each([
            { pathname: "/pathname", search: "?search=name", hash: "#hash" },
            { pathname: "/pathname", search: "?search=name", hash: "" },
            { pathname: "/pathname", search: "", hash: "#hash" },
        ])("Should set memorizedRoute to store from location", async ({ pathname, search, hash }) => {
            const error = {} as AxiosError;
            defineLocationProps({
                pathname,
                search,
                hash,
            });

            try {
                await onFailedRefresh(error);
            } catch (e) {
                expect(AuthStore.memorizedRoute).toEqual(`${pathname}${search}${hash}`);
            }
        });
    });

    describe("onForbidden util", () => {
        it("Should redirect to 403 page", async () => {
            const error = {} as AxiosError;
            try {
                await onForbidden({} as AxiosError);
            } catch (e) {
                expect(e).toEqual(error);
            }

            expect(Router.replace).toHaveBeenCalledWith(ROUTES.errors.forbidden.route);
        });
    });

    describe("onNotFound util", () => {
        it("Should redirect to 404 page", async () => {
            const error = {} as AxiosError;
            try {
                await onNotFound(error);
            } catch (e) {
                expect(e).toEqual(error);
            }

            expect(Router.replace).toHaveBeenCalledWith(ROUTES.errors.notFound.route);
        });
    });

    describe("handleApiErrorResponse util", () => {
        it("Should return rejected promise if its not an axios error", async () => {
            const error = { isAxiosError: false } as AxiosError;
            try {
                await handleApiErrorResponseWithQueue(error);
            } catch (e) {
                expect(e).toBeDefined();
                expect(e).toEqual(error);
            }
        });

        it("Should remove access token if request failed with 401 and user hasn't token", async () => {
            const error = mockAxiosError(401);
            try {
                await handleApiErrorResponseWithQueue(error);
            } catch (e) {
                expect(MOCKED_REMOVE_AUTH_TOKEN).toHaveBeenCalled();
                expect(e).toEqual(error);
            }
        });

        it("Should setup new access token when response is 401", async () => {
            const oldToken = "old token";
            const newToken = "new token";
            resolveServerResponse(MOCKED_AXIOS, {});
            resolveServerResponse(MOCKED_REFRESH_TOKEN, { access_token: newToken });
            const error = mockAxiosError(401);
            window.localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN, oldToken);

            await handleApiErrorResponseWithQueue(error);

            expect(MOCKED_REFRESH_TOKEN).toHaveBeenCalled();
            expect(MOCKED_SET_AUTH_TOKEN).toHaveBeenCalledWith(newToken);
            expect(MOCKED_REMOVE_AUTH_TOKEN_FROM_AXIOS_CONFIG).toHaveBeenCalled();
            expect(MOCKED_SET_AUTH_TOKEN_TO_ORIGINAL_REQUEST).toHaveBeenCalled();
            expect(MOCKED_AXIOS).toHaveBeenCalled();
        });

        it("Should remove access token page if refresh token failed", async () => {
            const oldToken = "old token";
            resolveServerResponse(MOCKED_AXIOS, {});
            rejectServerResponse(MOCKED_REFRESH_TOKEN, {});
            const error = mockAxiosError(401);
            window.localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN, oldToken);

            try {
                await handleApiErrorResponseWithQueue(error);
            } catch (e) {}

            expect(MOCKED_REFRESH_TOKEN).toHaveBeenCalled();
            expect(MOCKED_REMOVE_AUTH_TOKEN).toHaveBeenCalled();
        });

        it("Should return rejected promise if refetch original request failed", async () => {
            const oldToken = "old token";
            const newToken = "new token";
            const expectedError = "Smth went wrong";
            rejectServerResponse(MOCKED_AXIOS, { error: expectedError, config: {} });
            resolveServerResponse(MOCKED_REFRESH_TOKEN, { access_token: newToken });
            const error = mockAxiosError(401);
            window.localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN, oldToken);

            try {
                await handleApiErrorResponseWithQueue(error);
            } catch (e) {
                expect(e).toEqual({ error: expectedError, config: { isRetry: false } });
            }

            expect(MOCKED_REFRESH_TOKEN).toHaveBeenCalled();
            expect(MOCKED_REMOVE_AUTH_TOKEN_FROM_AXIOS_CONFIG).toHaveBeenCalled();
            expect(MOCKED_SET_AUTH_TOKEN_TO_ORIGINAL_REQUEST).toHaveBeenCalled();
            expect(MOCKED_AXIOS).toHaveBeenCalled();
        });
    });

    it.each([
        { code: 403, route: ROUTES.errors.forbidden.route },
        { code: 404, route: ROUTES.errors.notFound.route },
    ])("Should redirect to $code page if request failed with $code error", async ({ code, route }) => {
        const error = mockAxiosError(code);

        try {
            await handleApiErrorResponseWithQueue(error);
        } catch (e) {
            expect(e).toEqual(error);
        }

        expect(Router.replace).toHaveBeenCalledWith(route);
    });

    it("Should show toast message if request failed with status 500", async () => {
        const error = mockAxiosError(500);

        try {
            await handleApiErrorResponseWithQueue(error);
        } catch (e) {
            expect(e).toEqual(error);
        }

        expect(MOCKED_SHOW_ERROR_TOAST).toHaveBeenCalled();
    });

    it("Should return rejected promise if status is undefined", async () => {
        const error = mockAxiosError(undefined);

        try {
            await handleApiErrorResponseWithQueue(error);
        } catch (e) {
            expect(e).toEqual(error);
        }
    });
});
