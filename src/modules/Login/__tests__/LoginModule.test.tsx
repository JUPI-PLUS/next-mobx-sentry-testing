import {act, render, screen} from "@testing-library/react";
import LoginModule from "../LoginModule";
import {QueryClient, QueryClientProvider} from "react-query";
import userEvent from "@testing-library/user-event";
import {mockFunction, resolveServerResponse} from "../../../testingInfrustructure/utils";
import {rollbackErrorMessage} from "../../../shared/errors/errorMessages";
import {AUTH_LOCAL_STORAGE_KEYS} from "../../../shared/constants/auth";
import {login} from "../../../api/users";

const MOCK_ROUTER_REPLACE = jest.fn();
const MOCKED_ON = jest.fn();
const MOCKED_OFF = jest.fn();
const MOCKED_QUERY = jest.fn();

jest.mock("../../../api/config");
jest.mock("../../../api/users");
jest.mock("next/router", () => ({
    useRouter() {
        return {
            query: MOCKED_QUERY(),
            replace: MOCK_ROUTER_REPLACE,
            events: {
                on: MOCKED_ON,
                off: MOCKED_OFF
            }
        };
    }
}));

const queryClient = new QueryClient();

const MOCKED_LOGIN_REQUEST = mockFunction(login);
const MOCKED_SERVER_ERROR_MESSAGE = "Login failed";

const setup = () => {
    render(
        <QueryClientProvider client={queryClient}>
            <LoginModule/>
        </QueryClientProvider>
    );
};

describe("Login module", () => {
    it("Should render component without errors", () => {
        MOCKED_QUERY.mockReturnValue({});
        setup();

        expect(screen.getByRole("heading", {name: "Login"})).toBeInTheDocument();
    });

    it("Should show server validation message if user tries to login with incorrect creds", async () => {
        MOCKED_LOGIN_REQUEST.mockRejectedValue({
            response: {
                data: {
                    data: null,
                    message: MOCKED_SERVER_ERROR_MESSAGE,
                    status: "Error"
                }
            }
        });
        MOCKED_QUERY.mockReturnValue({});
        const MOCKED_EMAIL = "some@mail.com";
        const MOCKED_PASSWORD = "password";
        setup();

        await act(async () => {
            userEvent.paste(screen.getByLabelText("Email"), MOCKED_EMAIL);
        });

        await act(async () => {
            userEvent.paste(screen.getByLabelText("Password"), MOCKED_PASSWORD);
        });

        await act(async () => {
            userEvent.click(screen.getByRole("button", {name: "Login"}));
        });

        expect(screen.getByTestId("notification-error")).toBeInTheDocument();
        expect(screen.getByText(MOCKED_SERVER_ERROR_MESSAGE)).toBeInTheDocument();
    });

    it("Should show rollback validation message if server return empty error message", async () => {
        MOCKED_QUERY.mockReturnValue({});
        const MOCKED_EMAIL = "some@mail.com";
        const MOCKED_PASSWORD = "password";
        MOCKED_LOGIN_REQUEST.mockRejectedValue({
            response: {
                data: {
                    message: {}
                }
            }
        });
        setup();

        await act(async () => {
            userEvent.paste(screen.getByLabelText("Email"), MOCKED_EMAIL);
        });

        await act(async () => {
            userEvent.paste(screen.getByLabelText("Password"), MOCKED_PASSWORD);
        });

        await act(async () => {
            userEvent.click(screen.getByRole("button", {name: "Login"}));
        });

        expect(screen.getByTestId("notification-error")).toBeInTheDocument();
        expect(screen.getByText(rollbackErrorMessage)).toBeInTheDocument();
    });

    it("Should set token to LS on success response from server", async () => {
        MOCKED_QUERY.mockReturnValue({});
        const MOCKED_EMAIL = "some@mail.com";
        const MOCKED_PASSWORD = "password";
        const MOCKED_ACCESS_TOKEN = "My token";
        resolveServerResponse(MOCKED_LOGIN_REQUEST, { access_token: MOCKED_ACCESS_TOKEN })
        setup();

        await act(async () => {
            userEvent.paste(screen.getByLabelText("Email"), MOCKED_EMAIL);
        });

        await act(async () => {
            userEvent.paste(screen.getByLabelText("Password"), MOCKED_PASSWORD);
        });

        await act(async () => {
            userEvent.click(screen.getByRole("button", {name: "Login"}));
        });

        expect(window.localStorage.getItem(AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN)).toEqual(MOCKED_ACCESS_TOKEN);
        expect(MOCK_ROUTER_REPLACE).toHaveBeenCalled();
    });
});
