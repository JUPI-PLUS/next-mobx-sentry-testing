import { renderHook } from "@testing-library/react";
import { useLoggedIn } from "../useLoggedIn";
import { ROUTES } from "../../constants/routes";
import { AUTH_LOCAL_STORAGE_KEYS } from "../../constants/auth";
import { MOCKED_TOKEN } from "../../../testingInfrustructure/mocks/users";

const MOCKED_REPLACE = jest.fn();

jest.mock("next/router", () => ({
    useRouter() {
        return {
            replace: MOCKED_REPLACE
        }
    }
}))

describe("useLoggedIn", () => {
    it('Should replace to login page if user dont have token', () => {
        renderHook(useLoggedIn);

        expect(MOCKED_REPLACE).toHaveBeenCalledWith(ROUTES.login.route)
    });

    it("Should return isLoggedIn as true and isLoading as false if user have token", () => {
        window.localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN, MOCKED_TOKEN)
        const { result } = renderHook(useLoggedIn);

        expect(result.current.isLoading).toBeFalsy();
        expect(result.current.isLoggedIn).toBeTruthy();
    });
});