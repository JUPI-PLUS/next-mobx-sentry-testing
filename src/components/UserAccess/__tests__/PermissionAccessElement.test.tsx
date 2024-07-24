import { act, render, screen } from "@testing-library/react";
import PermissionAccessElement from "../PermissionAccess/PermissionAccessElement";
import { store } from "../../../shared/store";
import { OrdersPermission } from "../../../shared/models/permissions";

jest.mock("../../../api/users");

const MOCKED_CHILDREN_TEXT = "My pretty children";

const setup = (requiredPermissions: number | number[], tolerant = false) => {
    render(
        <PermissionAccessElement required={requiredPermissions} tolerant={tolerant}>
            <p>{MOCKED_CHILDREN_TEXT}</p>
        </PermissionAccessElement>
    );
};

describe("PermissionAccessElement", () => {
    it.each([
        {
            requiredPermissions: [OrdersPermission.VIEW_LIST],
            meData: [OrdersPermission.VIEW_LIST],
            tolerant: false,
        },
    ])(
        "Should render children if user role satisfy required role",
        async ({ requiredPermissions, meData, tolerant }) => {
            store.user.setupPermissions(meData);
            await act(async () => {
                setup(requiredPermissions, tolerant);
            });

            expect(screen.getByText(MOCKED_CHILDREN_TEXT)).toBeInTheDocument();
        }
    );
});
