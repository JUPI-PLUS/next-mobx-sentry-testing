import { AuthStore } from "../AuthStore";
import { removeAuthToken, setAuthToken } from "../../utils/auth";
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import { AUTH_LOCAL_STORAGE_KEYS } from "../../constants/auth";
import Router from "next/router";
import { ROUTES } from "../../constants/routes";
import { logout } from "../../../api/users";
import { act } from "@testing-library/react";

const MOCKED_SET_AUTH_TOKEN = mockFunction(setAuthToken);
const MOCKED_REMOVE_AUTH_TOKEN = mockFunction(removeAuthToken);

jest.mock("../../utils/auth");
jest.mock("../../utils/clearQueriesLogout");
jest.mock("../../../api/users");
jest.mock("next/router", () => ({ replace: jest.fn().mockResolvedValue({}) }));

const MOCKED_LOGOUT_REQUEST = mockFunction(logout);

describe("AuthStore", () => {
    it("Should login and logout", async () => {
        resolveServerResponse(MOCKED_LOGOUT_REQUEST, {})
        const store = new AuthStore();

        store.login();

        expect(store.isLoggedIn).toBe(true);

        await act(async () => {
            await store.logout();
        })

        expect(store.isLoggedIn).toBe(false);

    });

    it
        .each(["token", null])("Should set isLoggedIn call setAuthToken with token", (token) => {
            const store = new AuthStore();

            store.setAccessToken(token);

            expect(store.isLoggedIn).toBe(Boolean(token));
            expect(MOCKED_SET_AUTH_TOKEN).toHaveBeenCalledWith(token || "");
        });

    it("Should set token to system on LS update", () => {
        const newValue = "token";
        const oldValue = null;
        window.addEventListener = jest
            .fn()
            .mockImplementationOnce((event, callback) => {
                callback({ newValue, oldValue, key: AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN })
            })

        const store = new AuthStore();
        window.localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN, "token");

        expect(store.isLoggedIn).toBeTruthy();
        expect(MOCKED_SET_AUTH_TOKEN).toHaveBeenCalledWith(newValue);
        expect(Router.replace).toHaveBeenCalledWith(ROUTES.dashboard.route);
    });

    it("Should remove token from system and redirect to login when newValue is empty on LS update", () => {
        const newValue = null;
        const oldValue = "token";
        window.addEventListener = jest.fn()
            .mockImplementationOnce((event, callback) => {
                callback({ newValue, oldValue, key: AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN })
            })

        const store = new AuthStore();
        window.localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN, "");

        expect(store.isLoggedIn).toBeFalsy();
        expect(MOCKED_REMOVE_AUTH_TOKEN).toHaveBeenCalled();
        expect(Router.replace).toHaveBeenCalledWith(ROUTES.login.route);
    });
});