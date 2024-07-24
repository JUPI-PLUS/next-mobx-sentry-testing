import { Selector, t } from "testcafe";
import { APPLICATION_URL, INVALID_CREDS } from "../../shared/roles";
import LoginModel from "../../pageModels/Login/LoginModel";

fixture`Login page`.page(`${APPLICATION_URL}`);

// eslint-disable-next-line jest/expect-expect
test("Login via creds that doesn't exist in the system", async () => {
    // logging in manually in order to catch the error
    await LoginModel.login(INVALID_CREDS.email, INVALID_CREDS.password);
    const errorNotification = Selector("div").withAttribute("data-testid", "notification-error");

    await t.expect(errorNotification.textContent).eql("Login failed");
});
