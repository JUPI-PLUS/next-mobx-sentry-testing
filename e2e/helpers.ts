import { expect } from "@playwright/test";
import { Locator, Page } from "playwright-core";
import { TEST_URL } from "./constants";
import { LoginModel } from "./pageModels/LoginModel";

export const expectStatus = async (page: Page, url: string | RegExp, status: number) => {
    const responsePromise = await page.waitForResponse(url); //`**/api/v1/params_options?page=1&name=${option}`
    const response = await responsePromise;
    await expect(response.status()).toBe(status);
};

export const loginToSystem = async (page: Page, creds: { email: string; password: string }) => {
    await page.goto(TEST_URL);
    const loginPage = new LoginModel(page);
    await loginPage.login(creds);
    await expect(page.getByText(/Welcome/)).toBeVisible();
};

export const selectOption = async (page: Page, locator: Locator, value: number | string) => {
    await locator.fill(value.toString());
    await page.keyboard.press("Enter");
};
