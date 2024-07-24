import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { QueryClient, QueryClientProvider } from "react-query";
import { mockFunction, resolveServerResponse } from "../../../testingInfrustructure/utils";
import PermissionsModule from "../PermissionsModule";
import { addRolePermissions, createRole, deleteRole, getRolesList, updateRole } from "../../../api/roles";
import { MOCKED_USER_ROLES } from "../../../testingInfrustructure/mocks/dictionaries";
import { getPermissionsByRole, getPermissionsList } from "../../../api/permissions";
import { MOCKED_PERMISSIONS_DATA } from "../../../testingInfrustructure/mocks/users";
import { stringify } from "query-string";

jest.mock("../../../api/roles");
jest.mock("../../../api/permissions");

const MOCKED_ROLES_LIST = jest.fn();
const MOCKED_ROLES_LIST_REQUEST = mockFunction(getRolesList);
const MOCKED_ROLE_PERMISSIONS_REQUEST = mockFunction(addRolePermissions);
const MOCKED_UPDATE_ROLE = jest.fn();
const MOCKED_UPDATE_ROLE_REQUEST = mockFunction(updateRole);
const MOCKED_CREATE_ROLE_REQUEST = mockFunction(createRole);
const MOCKED_DELETE_ROLE_REQUEST = mockFunction(deleteRole);
const MOCKED_PERMISSIONS_LIST_BY_ROLE = jest.fn();
const MOCKED_PERMISSIONS_LIST_BY_ROLE_REQUEST = mockFunction(getPermissionsByRole);
const MOCKED_PERMISSIONS_LIST_REQUEST = mockFunction(getPermissionsList);
const MOCKED_ROLE_NAME = "New name";

jest.mock("next/router", () => ({
    useRouter() {
        return {
            push: jest.fn(),
            events: {
                on: jest.fn(),
                off: jest.fn(),
            },
        };
    },
}));

const setup = () => {
    const queryClient = new QueryClient();
    render(
        <QueryClientProvider client={queryClient}>
            <PermissionsModule />
        </QueryClientProvider>
    );
};

describe("PermissionsModule", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    beforeAll(() => {
        jest.useFakeTimers();
        MOCKED_ROLES_LIST.mockResolvedValue({ data: { data: MOCKED_USER_ROLES } });
        MOCKED_PERMISSIONS_LIST_BY_ROLE.mockResolvedValue({ data: { data: MOCKED_PERMISSIONS_DATA } });
        MOCKED_PERMISSIONS_LIST_REQUEST.mockResolvedValue({
            // @ts-ignore
            data: { data: MOCKED_PERMISSIONS_DATA },
        });
        MOCKED_ROLES_LIST_REQUEST.mockImplementation(() => MOCKED_ROLES_LIST);
        MOCKED_PERMISSIONS_LIST_BY_ROLE_REQUEST.mockImplementation(() => MOCKED_PERMISSIONS_LIST_BY_ROLE);
    });

    it.each(MOCKED_USER_ROLES)("Should render user roles into list", async ({ name }) => {
        await act(async () => {
            setup();
        });

        expect(screen.getByText(name)).toBeInTheDocument();
    });

    it.each(MOCKED_PERMISSIONS_DATA)("Should render permissions table", async ({ name, group }) => {
        await act(async () => {
            setup();
        });

        expect(screen.getByText(group)).toBeInTheDocument();
        expect(screen.getByText(name)).toBeInTheDocument();
    });

    it("Should render without errors", async () => {
        await act(async () => {
            setup();
        });

        expect(screen.getByText("Roles")).toBeInTheDocument();
        expect(screen.getByText("Find role")).toBeInTheDocument();
        expect(screen.getByText("Permissions")).toBeInTheDocument();
    });

    it("Should stringify filters & call request", async () => {
        const MOCKED_FILTERS = { name: "asd" };
        await act(async () => {
            setup();
        });
        await act(async () => {
            userEvent.paste(screen.getByRole("textbox"), MOCKED_FILTERS.name);
            jest.runOnlyPendingTimers();
        });

        expect(screen.getByText("Reset")).toBeInTheDocument();
        expect(MOCKED_ROLES_LIST_REQUEST).toHaveBeenNthCalledWith(3, stringify(MOCKED_FILTERS));
        expect(MOCKED_ROLES_LIST).toHaveBeenCalled();

        await act(async () => {
            userEvent.click(screen.getByTestId(`role-details-card-${MOCKED_USER_ROLES[0].name}`));
        });

        expect(MOCKED_PERMISSIONS_LIST_BY_ROLE).toHaveBeenCalled();

        await act(async () => {
            userEvent.click(screen.getByTestId(`role-details-card-${MOCKED_USER_ROLES[0].name}`));
        });
    });

    it("Should change visibility class on tap at accordion", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`accordion-title-${MOCKED_PERMISSIONS_DATA[0].group}`));
        });

        const accordionContent = screen.getByTestId(`accordion-content-${MOCKED_PERMISSIONS_DATA[0].group}`);
        expect(accordionContent).toBeInTheDocument();
    });

    it("Should display SummaryRow on updating permissions & call mutate function", async () => {
        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`role-details-card-${MOCKED_USER_ROLES[0].name}`));
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`accordion-checkbox-${MOCKED_PERMISSIONS_DATA[0].group}`));
        });

        const summaryRowSubmitButton = screen.getByTestId("submit-permissions-update");

        expect(summaryRowSubmitButton).toBeInTheDocument();

        await act(async () => {
            userEvent.click(summaryRowSubmitButton);
        });

        expect(MOCKED_ROLE_PERMISSIONS_REQUEST).toHaveBeenCalled();
    });

    it("Should set active role, open edit dialog & update a chosen role", async () => {
        resolveServerResponse(MOCKED_UPDATE_ROLE, { data: MOCKED_USER_ROLES[1] });
        MOCKED_UPDATE_ROLE_REQUEST.mockReturnValue(MOCKED_UPDATE_ROLE);

        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`role-details-card-${MOCKED_USER_ROLES[0].name}`));
        });

        expect(MOCKED_PERMISSIONS_LIST_BY_ROLE).toHaveBeenCalled();

        await act(async () => {
            userEvent.click(screen.getByTestId("edit-role-name"));
        });

        expect(screen.getByText("Edit role")).toBeInTheDocument;

        await act(async () => {
            userEvent.clear(screen.getByDisplayValue(MOCKED_USER_ROLES[0].name));
            userEvent.paste(screen.getByTestId("edit-role-name-input"), MOCKED_ROLE_NAME);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(MOCKED_UPDATE_ROLE).toHaveBeenCalledWith({ name: MOCKED_ROLE_NAME });
    });

    it("Should open add dialog & create a role", async () => {
        resolveServerResponse(MOCKED_CREATE_ROLE_REQUEST, { data: MOCKED_USER_ROLES[1] });

        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("add-role-dialog-button"));
        });

        expect(screen.getByText("Add role")).toBeInTheDocument;

        await act(async () => {
            userEvent.paste(screen.getByTestId("add-role-name"), MOCKED_ROLE_NAME);
        });

        await act(async () => {
            userEvent.click(screen.getByTestId("submit-dialog-button"));
        });

        expect(MOCKED_CREATE_ROLE_REQUEST).toHaveBeenCalledWith({ name: MOCKED_ROLE_NAME });
    });

    it("Should open delete dialog & delete a role", async () => {
        resolveServerResponse(MOCKED_DELETE_ROLE_REQUEST, { data: null });

        await act(async () => {
            setup();
        });

        await act(async () => {
            userEvent.click(screen.getByTestId(`role-details-card-${MOCKED_USER_ROLES[0].name}`));
        });

        expect(MOCKED_PERMISSIONS_LIST_BY_ROLE).toHaveBeenCalled();

        await act(async () => {
            userEvent.click(screen.getByText("Delete role"));
        });

        expect(screen.getByText("Delete role?")).toBeInTheDocument();

        await act(async () => {
            userEvent.click(screen.getByText("Delete"));
        });

        expect(MOCKED_DELETE_ROLE_REQUEST).toHaveBeenCalledWith({ id: MOCKED_USER_ROLES[0].id });
    });
});
