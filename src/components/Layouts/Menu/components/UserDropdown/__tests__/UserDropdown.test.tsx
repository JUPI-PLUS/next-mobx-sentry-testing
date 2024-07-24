import { act, render, screen } from "@testing-library/react";
import UserDropdown from "../UserDropdown";
import { removeAuthToken, isAccessAllowed } from "../../../../../../shared/utils/auth";
import { mockFunction, resolveServerResponse } from "../../../../../../testingInfrustructure/utils";
import { clearQueriesLogout } from "../../../../../../shared/utils/clearQueriesLogout";
import userEvent from "@testing-library/user-event";
import { logout } from "../../../../../../api/users";
import { MOCK_USER } from "../../../../../../testingInfrustructure/mocks/users";
import { ROUTES } from "../../../../../../shared/constants/routes";
import { store } from "../../../../../../shared/store";

const MOCKED_PUSH = jest.fn();
const MOCKED_ROUTER_REPLACE = jest.fn();
const MOCKED_REMOVE_AUTH_TOKEN = mockFunction(removeAuthToken);
const MOCKED_IS_ACCESS_ALLOWED = mockFunction(isAccessAllowed);
const MOCKED_CLEAR_QUERIES_LOGOUT = mockFunction(clearQueriesLogout);
const MOCKED_LOGOUT = mockFunction(logout);

jest.mock("../../../../../../shared/utils/auth");
jest.mock("../../../../../../api/users");
jest.mock("../../../../../../shared/utils/clearQueriesLogout");
jest.mock("next/router", () => ({
    replace: () => Promise.resolve(MOCKED_ROUTER_REPLACE()),
    useRouter() {
        return {
            push: MOCKED_PUSH,
        };
    },
}));

const setup = () => {
    render(<UserDropdown />);
};

const MOCKED_USER = MOCK_USER({});

describe("UserDropdown component", () => {
    beforeAll(() => {
        MOCKED_IS_ACCESS_ALLOWED.mockReturnValue(true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("Should render without errors", () => {
        setup();

        expect(screen.getByText("Profile")).toBeInTheDocument();
        expect(screen.getByText("Logout")).toBeInTheDocument();
    });

    it("Should redirect to Profile settings page by clicking on 'Profile' button in dropdown", async () => {
        store.user.setUser(MOCKED_USER);
        setup();

        await act(async () => {
            userEvent.click(screen.getByTestId("profile-settings-menu-item"));
        });

        expect(MOCKED_PUSH).toHaveBeenCalledWith({
            pathname: ROUTES.patientProfile.route,
            query: { patientUUID: MOCKED_USER.uuid },
        });
    });

    it("Should redirect to login page and clean auth token", async () => {
        resolveServerResponse(MOCKED_LOGOUT, {});
        resolveServerResponse(MOCKED_ROUTER_REPLACE, {});
        setup();

        await act(async () => {
            userEvent.click(screen.getByText("Logout"));
        });

        expect(MOCKED_ROUTER_REPLACE).toHaveBeenCalledTimes(1);
        expect(MOCKED_CLEAR_QUERIES_LOGOUT).toHaveBeenCalled();
        expect(MOCKED_REMOVE_AUTH_TOKEN).toHaveBeenCalled();
    });
});
