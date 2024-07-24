import { Locator, Page } from "playwright-core";
import { expect } from "@playwright/test";

export class DialogModel {
    readonly page: Page;

    // Buttons
    readonly submitButton: Locator;
    readonly cancelButton: Locator;
    readonly closeButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.submitButton = page.getByTestId("submit-dialog-button");
        this.cancelButton = page.getByTestId("cancel-dialog-button");
        this.closeButton = page.getByTestId("close-dialog-button");
    }

    async close() {
        await this.closeButton.click();
    }

    async submit() {
        await expect(this.submitButton).toBeEnabled();
        await this.submitButton.click();
    }

    async cancel() {
        await expect(this.submitButton).toBeEnabled();
        await this.cancelButton.click();
    }
}
