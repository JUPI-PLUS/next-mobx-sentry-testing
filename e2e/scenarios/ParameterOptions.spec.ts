import { test, expect } from "@playwright/test";
import { ParameterOptionsModel } from "../pageModels/ParameterOptionsModel";
import { faker } from "@faker-js/faker";
import { DialogModel } from "../componentModels/DialogModel";
import { ToastModel } from "../componentModels/ToastModel";
import { ADMIN_CREDS, BE_URL, TEST_URL } from "../constants";
import { expectStatus, loginToSystem } from "../helpers";

const EXPERIMENTAL_OPTIONS: string[] = [];

test.describe("ParameterOptions scenario", async () => {
    test.beforeEach(async ({ page }) => {
        await loginToSystem(page, ADMIN_CREDS);
    });

    test.afterAll(async ({ page }) => {
        await page.goto(TEST_URL);
        const dialog = new DialogModel(page);
        const parameterOptionsPage = new ParameterOptionsModel(page, dialog);
        const toast = new ToastModel(page);
        await parameterOptionsPage.goto();
        for (const option of EXPERIMENTAL_OPTIONS) {
            await parameterOptionsPage.fillFilters({ name: option });
            await expectStatus(page, `${BE_URL}params_options?page=1&name=${option}`, 200);
            await expect(parameterOptionsPage.actionButton).toBeVisible();
            await parameterOptionsPage.actionButton.click();
            await parameterOptionsPage.deleteButton.click();
            await dialog.submit();
            await toast.hasTitle("Option has been deleted");
            await toast.close();
            await parameterOptionsPage.resetFilters();
        }
    });

    test("Create parameter option", async ({ page }) => {
        const EXPERIMENTAL_OPTION = faker.random.alpha(10);
        const dialog = new DialogModel(page);
        const parameterOptionsPage = new ParameterOptionsModel(page, dialog);
        const toast = new ToastModel(page);

        await parameterOptionsPage.goto();
        await parameterOptionsPage.addOption({ name: EXPERIMENTAL_OPTION });
        await toast.hasTitle("Option has been created");
        await toast.close();
        await parameterOptionsPage.fillFilters({ name: EXPERIMENTAL_OPTION });
        EXPERIMENTAL_OPTIONS.push(EXPERIMENTAL_OPTION);
        await expect(page.getByText(EXPERIMENTAL_OPTION)).toBeVisible();
    });

    test("Edit parameter option", async ({ page }) => {
        const EXPERIMENTAL_OPTION = faker.random.alpha(10);
        const UPDATED_EXPERIMENTAL_OPTION = faker.random.alpha(10);
        const dialog = new DialogModel(page);
        const parameterOptionsPage = new ParameterOptionsModel(page, dialog);
        const toast = new ToastModel(page);

        await parameterOptionsPage.goto();
        await parameterOptionsPage.addOption({ name: EXPERIMENTAL_OPTION });
        await toast.hasTitle("Option has been created");
        await toast.close();
        await parameterOptionsPage.fillFilters({ name: EXPERIMENTAL_OPTION });
        await expectStatus(page, `${BE_URL}params_options?page=1&name=${EXPERIMENTAL_OPTION}`, 200);

        await parameterOptionsPage.openEditDialog();
        await parameterOptionsPage.fillForm({ name: UPDATED_EXPERIMENTAL_OPTION });
        await dialog.submit();
        EXPERIMENTAL_OPTIONS.push(UPDATED_EXPERIMENTAL_OPTION);
        await toast.hasTitle("Option has been updated");
        await toast.close();
    });

    test("Delete parameter option", async ({ page }) => {
        const EXPERIMENTAL_OPTION = faker.random.alpha(10);
        const dialog = new DialogModel(page);
        const parameterOptionsPage = new ParameterOptionsModel(page, dialog);
        const toast = new ToastModel(page);

        await parameterOptionsPage.goto();
        await parameterOptionsPage.addOption({ name: EXPERIMENTAL_OPTION });
        await toast.hasTitle("Option has been created");
        await toast.close();
        await parameterOptionsPage.fillFilters({ name: EXPERIMENTAL_OPTION });
        await expectStatus(page, `${BE_URL}params_options?page=1&name=${EXPERIMENTAL_OPTION}`, 200);

        await parameterOptionsPage.openDeleteDialog();
        await dialog.submit();
        await toast.hasTitle("Option has been deleted");
        await toast.close();

        await parameterOptionsPage.fillFilters({ name: EXPERIMENTAL_OPTION });
        await expect(page.getByText(EXPERIMENTAL_OPTION)).toBeHidden();
    });

    // test.skip("Try to delete option that already used", () => {});
});
