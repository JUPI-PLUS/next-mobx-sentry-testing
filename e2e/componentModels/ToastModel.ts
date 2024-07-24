import { Locator, Page } from "playwright-core";
import { expect } from "@playwright/test";

export class ToastModel {
    // Elements
    private readonly _title: Locator;
    private readonly _message: Locator;

    // Buttons
    private readonly _closeButton: Locator;

    constructor(page: Page) {
        this._title = page.getByTestId("toast-title");
        this._message = page.getByTestId("toast-message");
        this._closeButton = page.getByTestId("toast-close-btn");
    }

    async close() {
        await this._closeButton.click();
    }

    async hasTitle(title: string) {
        await expect(this._title).toHaveText(title);
    }

    async isHidden() {
        await expect(this._title).toBeHidden();
    }

    async hasMessage(message: string) {
        await expect(this._message).toHaveText(message);
    }
}
