import { Selector, t } from "testcafe";
import { AddRoleData, UpdateRoleData } from "../../../src/modules/PermissionsModule/models";
import DialogModel from "../../components/Dialog/DialogModel";

export class PermissionsModel {
    //filters
    filterByNameInput: Selector = Selector("#name");
    resetFiltersButton: Selector = Selector("span").withAttribute("data-testid", "reset-roles-filters");

    //edit role dialog
    roleDialogNameInput: Selector = Selector("#name");

    //header
    closeActiveRoleButton: Selector = Selector("button").withAttribute("data-testid", "close-active-role");
    createRoleButton: Selector = Selector("button").withAttribute("data-testid", "add-role-dialog-button");
    editRoleByNameButton: Selector = Selector("button").withAttribute("data-testid", "edit-role-name");
    deleteRoleButton: Selector = Selector("button").withAttribute("data-testid", "delete-role-button");

    //table
    rolesWithPermissionPopper: Selector = Selector("div").withAttribute("data-testid", "roles-by-permission-popper");
    cancelPermissionsUpdateButton: Selector = Selector("button").withAttribute(
        "data-testid",
        "cancel-permissions-update"
    );

    submitPermissionsUpdateButton: Selector = Selector("button").withAttribute(
        "data-testid",
        "submit-permissions-update"
    );

    accordionByTitle(title: string) {
        return Selector("div").withAttribute("data-testid", `accordion-title-${title}`);
    }

    accordionCheckboxByTitle(title: string) {
        return Selector("input").withAttribute("data-testid", `accordion-checkbox-${title}`);
    }

    accordionPermissionCheckboxByPermissionId(id: number) {
        return Selector(`#${id}`);
    }

    rolesWithPermissionButton(id: number) {
        return Selector("button").withAttribute("data-testid", `roles-with-${id}-permission-button`);
    }

    roleByPermission(id: number) {
        return Selector(`role-${id}-by-permission`);
    }

    roleCardByName(name: string) {
        return Selector("div").withAttribute("data-testid", `role-details-card-${name}`);
    }

    async fillEditRoleForm({ name }: UpdateRoleData) {
        await t.click(this.editRoleByNameButton).typeText(this.roleDialogNameInput, name);
    }

    async fillCreateRoleForm({ name }: AddRoleData) {
        await t.click(this.createRoleButton).typeText(this.roleDialogNameInput, name);
    }

    async submitRoleDialog() {
        await t.click(DialogModel.submitDialogButton);
    }
}

export default new PermissionsModel();
