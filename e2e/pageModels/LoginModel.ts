import { Locator, Page } from "playwright-core";

export class LoginModel {
    readonly page: Page;

    // Controls
    readonly emailInput: Locator;
    readonly passwordInput: Locator;

    // Buttons
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.emailInput = page.locator("#email");
        this.passwordInput = page.locator("#password");
        this.submitButton = page.getByTestId("login-submit-button");
    }

    async login({ email, password }: { email: string; password: string }) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.submitButton.click();
    }
}
