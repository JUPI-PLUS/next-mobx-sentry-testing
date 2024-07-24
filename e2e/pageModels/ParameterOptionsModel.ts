import { OptionFormData } from "../../src/modules/ParameterOptions/models";
import { Locator, Page } from "playwright-core";
import { TEST_URL } from "../constants";
import { ROUTES } from "../../src/shared/constants/routes";
import { DialogModel } from "../componentModels/DialogModel";

export class ParameterOptionsModel {
    readonly page: Page;
    readonly dialog: DialogModel;

    // Controls
    readonly nameFilterInput: Locator;
    readonly dialogNameInput: Locator;

    // Buttons
    readonly createOptionButton: Locator;
    readonly actionButton: Locator;
    readonly editButton: Locator;
    readonly deleteButton: Locator;
    readonly resetNameFilter: Locator;

    constructor(page: Page, dialog: DialogModel) {
        this.page = page;
        this.dialog = dialog;
        this.nameFilterInput = page.getByTestId("name-filter-input");
        this.dialogNameInput = page.getByTestId("option-name-field");
        this.createOptionButton = page.getByTestId("create-option-button");
        this.actionButton = page.getByTestId("action-button");
        this.editButton = page.getByTestId("edit-option");
        this.deleteButton = page.getByTestId("delete-option");
        this.resetNameFilter = page.getByTestId("reset-icon");
    }

    async goto() {
        await this.page.goto(`${TEST_URL}${ROUTES.parameterOptions.route}`);
    }

    async fillForm({ name }: OptionFormData) {
        await this.dialogNameInput.clear();
        await this.dialogNameInput.fill(name);
    }

    async addOption({ name }: OptionFormData) {
        await this.createOptionButton.click();
        await this.fillForm({ name });
        await this.dialog.submit();
    }

    async fillFilters({ name }: OptionFormData) {
        await this.nameFilterInput.clear();
        await this.nameFilterInput.fill(name);
    }

    async resetFilters() {
        await this.resetNameFilter.click();
    }

    async openEditDialog() {
        await this.actionButton.click();
        await this.editButton.click();
    }

    async openDeleteDialog() {
        await this.actionButton.click();
        await this.deleteButton.click();
    }
}
