import {
    isAccessAllowed,
    removeAuthToken,
    removeAuthTokenFromAxiosConfig,
    setAuthToken,
    setAuthTokenToOriginalRequest,
    setPermissionsFromDecodedAuthToken,
} from "../auth";
import { AUTH_LOCAL_STORAGE_KEYS } from "../../constants/auth";
import { limsClient } from "../../../api/config";
import { MOCKED_TOKEN, MOCKED_PERMISSIONS_IDS } from "../../../testingInfrustructure/mocks/users";
import UserStore from "../../store/UserStore";

describe("auth utils", () => {
    describe("setAuthToken", () => {
        it("Should set token to LS", () => {
            setAuthToken(MOCKED_TOKEN);

            expect(limsClient.defaults.headers.common.Authorization).toBeDefined();
            expect(limsClient.defaults.headers.common.Authorization).toBe(`Bearer ${MOCKED_TOKEN}`);
            expect(window.localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN)).toBe(MOCKED_TOKEN);
        });
    });

    describe("removeAuthToken", () => {
        it("Should remove token from LS", () => {
            setAuthToken(MOCKED_TOKEN);

            expect(limsClient.defaults.headers.common.Authorization).toBe(`Bearer ${MOCKED_TOKEN}`);
            expect(window.localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN)).toBe(MOCKED_TOKEN);

            removeAuthToken();

            expect(limsClient.defaults.headers.common.Authorization).not.toBeDefined();
            expect(window.localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN)).not.toBeDefined();
        });
    });

    describe("removeAuthTokenFromAxiosConfig", () => {
        it("Should remove token from config", () => {
            const initialConfig = { headers: { Authorization: MOCKED_TOKEN } };
            removeAuthTokenFromAxiosConfig(initialConfig);

            expect(initialConfig).toEqual({ headers: {} });
        });

        it("Should not remove token if config without headers", () => {
            const initialConfig = { headers: undefined };
            removeAuthTokenFromAxiosConfig(initialConfig);

            expect(initialConfig).toEqual(initialConfig);
        });
    });

    describe("setAuthTokenToOriginalRequest", () => {
        it("Should set token to config headers", () => {
            const initialConfig = {
                headers: {
                    Authorization: "",
                },
            };

            // @ts-ignore
            setAuthTokenToOriginalRequest(initialConfig, MOCKED_TOKEN);

            expect(initialConfig).toEqual({ headers: { Authorization: `Bearer ${MOCKED_TOKEN}` } });
        });
    });

    describe("setPermissionsFromDecodedAuthToken", () => {
        it("Should set permissions to store from decoded token", () => {
            setPermissionsFromDecodedAuthToken(MOCKED_TOKEN);

            expect(UserStore.permissions).toEqual([...MOCKED_PERMISSIONS_IDS].sort((a, b) => a - b));
        });
        it("Shouldn't set permissions when token's broken", () => {
            setPermissionsFromDecodedAuthToken("");

            expect(UserStore.permissions).toEqual([]);
        });
    });

    describe("isAccessAllowed", () => {
        it.each([
            {
                current: [1],
                required: [1],
                tolerant: true,
                expected: true,
            },
            {
                current: [1],
                required: [1],
                tolerant: false,
                expected: true,
            },
            {
                current: [1],
                required: [1, 2],
                tolerant: true,
                expected: true,
            },
            {
                current: [1],
                required: [1, 2],
                tolerant: false,
                expected: false,
            },
            {
                current: [1],
                required: 1,
                tolerant: true,
                expected: true,
            },
            {
                current: [1],
                required: 1,
                tolerant: false,
                expected: true,
            },
            {
                current: [1],
                required: 2,
                tolerant: true,
                expected: false,
            },
            {
                current: [1],
                required: 2,
                tolerant: false,
                expected: false,
            },
        ])("Should return if access's allowed", ({ current, required, tolerant, expected }) => {
            const result = isAccessAllowed(current, required, tolerant);

            expect(result).toBe(expected);
        });
    });
});
