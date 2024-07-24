// libs
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { act } from "react-dom/test-utils";

// api
import { me } from "../../../../api/users";

// stores
import AuthStore from "../../../../shared/store/AuthStore";

// helpers
import { limsClient } from "../../../../api/config";
import { mockFunction, resolveServerResponse } from "../../../../testingInfrustructure/utils";
import { defineLocationProps } from "../../../../testingInfrustructure/helpers";

// constants
import { ROUTES } from "../../../../shared/constants/routes";
import { AUTH_LOCAL_STORAGE_KEYS } from "../../../../shared/constants/auth";

// components
import PrivateLayout from "../PrivateLayout";

// mocks
import { MOCKED_TOKEN, MOCK_USER } from "../../../../testingInfrustructure/mocks/users";

const MOCK_ROUTER_REPLACE = jest.fn();
const MOCKED_CHILDREN_TEXT = "Hello!";
const MOCKED_CHILDREN = <p>{MOCKED_CHILDREN_TEXT}</p>;
const MOCKED_ME = mockFunction(me);

jest.mock("../../../../api/users");
jest.mock("../../../../shared/utils/clearQueriesLogout");

jest.mock("next/router", () => ({
    useRouter() {
        return {
            pathname: ROUTES.orders.list.route,
            replace: MOCK_ROUTER_REPLACE,
        };
    },
}));

const setup = () => {
    const queryClient = new QueryClient();

    render(
        <QueryClientProvider client={queryClient}>
            <PrivateLayout>{MOCKED_CHILDREN}</PrivateLayout>
        </QueryClientProvider>
    );
};

describe("PrivateLayout", () => {
    afterEach(() => {
        defineLocationProps();
    });

    it("Should redirect to login page if user dont have access token", async () => {
        resolveServerResponse(MOCKED_ME, { data: MOCK_USER({}) });

        await act(() => {
            setup();
        });

        expect(MOCK_ROUTER_REPLACE).toHaveBeenCalledWith(ROUTES.login.route);
    });

    it.each([
        { pathname: "/pathname", search: "?search=name", hash: "#hash" },
        { pathname: "/pathname", search: "?search=name", hash: "" },
        { pathname: "/pathname", search: "", hash: "#hash" },
        { pathname: "/", search: "", hash: "" },
    ])(
        "Should redirect to login page and save current route in store if user dont have access token",
        async ({ pathname, search, hash }) => {
            resolveServerResponse(MOCKED_ME, { data: MOCK_USER({}) });
            defineLocationProps({
                pathname,
                search,
                hash,
            });

            await act(() => {
                setup();
            });

            expect(AuthStore.memorizedRoute).toEqual(`${pathname}${search}${hash}`);
            expect(MOCK_ROUTER_REPLACE).toHaveBeenCalledWith(ROUTES.login.route);
        }
    );

    it("Should render without errors", async () => {
        resolveServerResponse(MOCKED_ME, { data: MOCK_USER({}) });
        window.localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN, MOCKED_TOKEN);

        await act(async () => {
            setup();
        });

        expect(screen.getByText(MOCKED_CHILDREN_TEXT)).toBeInTheDocument();
    });

    it("Should not redirect to login page if user have access token", async () => {
        resolveServerResponse(MOCKED_ME, { data: MOCK_USER({}) });
        window.localStorage.setItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN, MOCKED_TOKEN);

        await act(async () => {
            setup();
        });

        expect(limsClient.defaults.headers.common.Authorization).toEqual(`Bearer ${MOCKED_TOKEN}`);
    });
});
