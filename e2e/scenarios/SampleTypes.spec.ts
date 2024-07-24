import { test } from "@playwright/test";
import { loginToSystem } from "../helpers";
import { ADMIN_CREDS, TEST_URL } from "../constants";
import { DialogModel } from "../componentModels/DialogModel";
import { ToastModel } from "../componentModels/ToastModel";
import { SampleTypesModel } from "../pageModels/SampleTypesModel";
import { DrawerModel } from "../componentModels/DrawerModel";
import { Page } from "playwright-core";
import { faker } from "@faker-js/faker";

const EXPERIMENTAL_SAMPLE_TYPE_NAMES: string[] = [];
const AVAILABLE_CODES = ["01", "02", "03"];

const setup = (page: Page): SampleTypesModel => {
    const drawer = new DrawerModel(page);
    const dialog = new DialogModel(page);
    const toast = new ToastModel(page);
    return new SampleTypesModel(page, drawer, dialog, toast);
};

test.describe("SampleTypes scenario", async () => {
    test.beforeEach(async ({ page }) => {
        await loginToSystem(page, ADMIN_CREDS);
    });

    test.afterAll(async ({ page }) => {
        await page.goto(TEST_URL);
        const sampleTypesPage = setup(page);
        await sampleTypesPage.goto();
        for (const experimentalSampleTypeName of EXPERIMENTAL_SAMPLE_TYPE_NAMES) {
            await sampleTypesPage.deleteSampleType(experimentalSampleTypeName);
        }
    });

    test("Create sample type", async ({ page }) => {
        const EXPERIMENTAL_SAMPLE_TYPE = {
            code: AVAILABLE_CODES[0],
            name: faker.random.alpha(10),
        };
        const sampleTypesPage = setup(page);
        await sampleTypesPage.goto();
        await sampleTypesPage.createSampleType(EXPERIMENTAL_SAMPLE_TYPE);
        EXPERIMENTAL_SAMPLE_TYPE_NAMES.push(EXPERIMENTAL_SAMPLE_TYPE.name);
    });

    test("Edit sample type", async ({ page }) => {
        const EXPERIMENTAL_SAMPLE_TYPE = {
            code: AVAILABLE_CODES[1],
            name: faker.random.alpha(10),
        };

        const UPDATED_EXPERIMENTAL_SAMPLE_TYPE = {
            code: AVAILABLE_CODES[1],
            name: faker.random.alpha(10),
        };

        const sampleTypesPage = setup(page);
        await sampleTypesPage.goto();
        await sampleTypesPage.createSampleType(EXPERIMENTAL_SAMPLE_TYPE);
        await sampleTypesPage.editSampleType(EXPERIMENTAL_SAMPLE_TYPE.code, UPDATED_EXPERIMENTAL_SAMPLE_TYPE);
        EXPERIMENTAL_SAMPLE_TYPE_NAMES.push(UPDATED_EXPERIMENTAL_SAMPLE_TYPE.name);
    });

    test("Delete sample type", async ({ page }) => {
        const EXPERIMENTAL_SAMPLE_TYPE = {
            code: AVAILABLE_CODES[2],
            name: faker.random.alpha(10),
        };

        const sampleTypesPage = setup(page);
        await sampleTypesPage.goto();
        await sampleTypesPage.createSampleType(EXPERIMENTAL_SAMPLE_TYPE);
        await sampleTypesPage.deleteSampleType(EXPERIMENTAL_SAMPLE_TYPE.code);
    });

    // test.skip("Try to delete used sample type and get a list of exam templates where this sample type used", async () => {});
});
