import { Locator, Page } from "playwright-core";
import { expect } from "@playwright/test";

export class DrawerModel {
    // Buttons
    private readonly _closeDrawerButton: Locator;
    private readonly _submitButton: Locator;
    private readonly _cancelButton: Locator;
    private readonly _optionalButton: Locator;

    constructor(page: Page) {
        this._closeDrawerButton = page.getByTestId("close-drawer-button");
        this._submitButton = page.getByTestId("submit-drawer-button");
        this._cancelButton = page.getByTestId("cancel-drawer-button");
        this._optionalButton = page.getByTestId("optional-drawer-button");
    }

    async submit() {
        await expect(this._submitButton).toBeEnabled();
        await this._submitButton.click();
    }

    async cancel() {
        await expect(this._cancelButton).toBeEnabled();
        await this._cancelButton.click();
    }

    async close() {
        await this._closeDrawerButton.click();
    }

    async clickOptionalButton() {
        await this._optionalButton.click();
    }
}
