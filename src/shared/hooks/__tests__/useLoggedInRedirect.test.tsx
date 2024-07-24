// libs
import { renderHook } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { observer } from "mobx-react";

// stores
import { store } from "../../store";

// constants
import { ROUTES } from "../../constants/routes";

// components
import { useLoggedInRedirect } from "../useLoggedInRedirect";

// mocks
import { MOCK_USER } from "../../../testingInfrustructure/mocks/users";

const MOCKED_REDIRECT = jest.fn();
const MOCKED_MEMOIZED_ROUTE = "/pathname?search=name#hash";

jest.mock("../../../api/users");
jest.mock("next/router", () => ({
    useRouter() {
        return {
            replace: MOCKED_REDIRECT,
        };
    },
}));

const queryClient = new QueryClient();
// @ts-ignore
const wrapper = observer(({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>);

describe("useLoggedInRedirect", () => {
    it("Should return isLoading as true on default render hook", () => {
        const { result } = renderHook(() => useLoggedInRedirect(), { wrapper });

        expect(result.current).toBeTruthy();
    });

    it("Should redirect to dashboard if user logged in and memoized route is not defined", async () => {
        store.user.setUser(MOCK_USER({}));
        store.auth.isLoggedIn = true;

        renderHook(() => useLoggedInRedirect(), { wrapper });

        expect(MOCKED_REDIRECT).toHaveBeenCalledWith(ROUTES.dashboard.route);
    });

    it("Should redirect to memoized route from store if it exist and if user logged in", async () => {
        store.user.setUser(MOCK_USER({}));
        store.auth.isLoggedIn = true;
        store.auth.setMemorizedRoute(MOCKED_MEMOIZED_ROUTE);

        renderHook(() => useLoggedInRedirect(), { wrapper });

        expect(MOCKED_REDIRECT).toHaveBeenCalledWith(MOCKED_MEMOIZED_ROUTE);
    });
});
