import { Selector, t } from "testcafe";

class LoginModel {
    emailInput: Selector = Selector("#email");
    passwordInput: Selector = Selector("#password");
    showPasswordButton: Selector = Selector("svg").withAttribute("data-testid", "show-password-icon");
    submitButton: Selector = Selector("button").withAttribute("data-testid", "login-submit-button");

    async clickSubmit() {
        await t.click(this.submitButton);
    }

    async typeEmail(email: string) {
        await t.typeText(this.emailInput, email);
    }

    async typePassword(password: string) {
        await t.typeText(this.passwordInput, password);
    }

    async fillForm(email: string, password: string) {
        await this.typeEmail(email);
        await this.typePassword(password);
    }

    async login(email: string, password: string) {
        await this.fillForm(email, password);
        await this.clickSubmit();
    }
}

export default new LoginModel();
