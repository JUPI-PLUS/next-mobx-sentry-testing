import { test } from "@playwright/test";
import { expectStatus, loginToSystem } from "../helpers";
import { ADMIN_CREDS } from "../constants";
import { ExperimentalWorkplaceFormValues, WorkplacesModel } from "../pageModels/WorkplacesModel";
import { Page } from "playwright-core";
import { faker } from "@faker-js/faker";

const EXPERIMENTAL_WORKPLACES_NAMES: string[] = [];
const MOCK_WORKPLACE = (): ExperimentalWorkplaceFormValues => ({
    name: faker.random.alpha(10),
    code: faker.random.alpha(10),
    status: faker.datatype.number({ min: 1, max: 2 }),
    notes: faker.lorem.text(),
    // TODO: Create exam templates before test.
    examTemplates: ["Vitamin B12", "25-OH-Vitamin D", "TEST_EXAM²"],
});

const setup = (page: Page): WorkplacesModel => {
    return new WorkplacesModel(page);
};

test.describe("Workplaces scenario", async () => {
    test.beforeEach(async ({ page }) => {
        await loginToSystem(page, ADMIN_CREDS);
    });

    test.afterAll(async ({ page }) => {
        const workplacePage = setup(page);
        await workplacePage.goto();
        for (const workplaceName of EXPERIMENTAL_WORKPLACES_NAMES) {
            await workplacePage.delete(workplaceName);
        }
    });

    test("Create workplace", async ({ page }) => {
        const EXPERIMENTAL_WORKPLACE = MOCK_WORKPLACE();
        const workplacePage = setup(page);
        await workplacePage.goto();
        await expectStatus(page, /workplaces/gi, 200);
        await workplacePage.create(EXPERIMENTAL_WORKPLACE);
        await workplacePage.find({
            nameOrCode: EXPERIMENTAL_WORKPLACE.name,
            expectedWPName: EXPERIMENTAL_WORKPLACE.name,
        });
        EXPERIMENTAL_WORKPLACES_NAMES.push(EXPERIMENTAL_WORKPLACE.name);
    });

    test("Edit workplace", async ({ page }) => {
        const UPDATED_WORKPLACE = MOCK_WORKPLACE();
        const workplacePage = setup(page);
        await workplacePage.goto();
        await workplacePage.edit(EXPERIMENTAL_WORKPLACES_NAMES[0], UPDATED_WORKPLACE);
        EXPERIMENTAL_WORKPLACES_NAMES[0] = UPDATED_WORKPLACE.name;
    });

    test("Delete workplace", async ({ page }) => {
        const EXPERIMENTAL_WORKPLACE = MOCK_WORKPLACE();
        const workplacePage = setup(page);
        await workplacePage.goto();
        await workplacePage.create(EXPERIMENTAL_WORKPLACE);
        await workplacePage.delete(EXPERIMENTAL_WORKPLACE.name);
    });

    // test.skip("Try to delete workplace that has exams in system")
});
