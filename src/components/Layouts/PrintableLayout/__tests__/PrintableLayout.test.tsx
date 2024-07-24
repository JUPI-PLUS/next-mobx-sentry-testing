import { render, screen } from "@testing-library/react";
import PrintableLayout from "../PrintableLayout";
import { ROUTES } from "../../../../shared/constants/routes";
import { AUTH_LOCAL_STORAGE_KEYS } from "../../../../shared/constants/auth";
import { limsClient } from "../../../../api/config";
import { mockFunction, resolveServerResponse } from "../../../../testingInfrustructure/utils";
import { QueryClient, QueryClientProvider } from "react-query";
import { me } from "../../../../api/users";
import { act } from "react-dom/test-utils";
import { MOCKED_TOKEN, MOCK_USER } from "../../../../testingInfrustructure/mocks/users";

const MOCK_ROUTER_REPLACE = jest.fn();
const MOCKED_CHILDREN_TEXT = "Hello!";
const MOCKED_CHILDREN = <p>{MOCKED_CHILDREN_TEXT}</p>;
const MOCKED_ME = mockFunction(me);

jest.mock("../../../../api/users");

jest.mock("next/router", () => ({
    useRouter() {
        return {
            replace: MOCK_ROUTER_REPLACE,
        };
    },
}));

const setup = () => {
    const queryClient = new QueryClient();

    render(
        <QueryClientProvider client={queryClient}>
            <PrintableLayout>{MOCKED_CHILDREN}</PrintableLayout>
        </QueryClientProvider>
    );
};

describe("PrintableLayout", () => {
    it("Should redirect to login page if user dont have access token", async () => {
        resolveServerResponse(MOCKED_ME, { data: MOCK_USER({}) });

        await act(() => {
            setup();
        });

        expect(MOCK_ROUTER_REPLACE).toHaveBeenCalledWith(ROUTES.login.route);
    });

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
