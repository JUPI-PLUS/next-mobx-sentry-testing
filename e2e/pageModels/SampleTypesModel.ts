import { Locator, Page } from "playwright-core";
import { expect } from "@playwright/test";
import { DrawerModel } from "../componentModels/DrawerModel";
import { DialogModel } from "../componentModels/DialogModel";
import { ToastModel } from "../componentModels/ToastModel";
import { BE_URL, TEST_URL } from "../constants";
import { ROUTES } from "../../src/shared/constants/routes";
import { expectStatus } from "../helpers";

interface SampleTypeFormValues {
    code: string;
    name: string;
}

export class SampleTypesModel {
    private readonly _page: Page;

    // UI Elements
    private readonly _drawer: DrawerModel;
    private readonly _dialog: DialogModel;
    private readonly _toast: ToastModel;

    // page controls
    private readonly _searchInput: Locator;

    // page buttons
    private readonly _createSampleTypeButton: Locator;

    // creation controls
    private readonly _codeInput: Locator;
    private readonly _nameInput: Locator;

    // table actions
    private readonly _tableActionButton: Locator;
    private readonly _editActionButton: Locator;
    private readonly _deleteActionButton: Locator;

    constructor(page: Page, drawer: DrawerModel, dialog: DialogModel, toast: ToastModel) {
        this._page = page;
        this._drawer = drawer;
        this._dialog = dialog;
        this._toast = toast;
        this._searchInput = page.getByTestId("name-filter-input");
        this._createSampleTypeButton = page.getByTestId("add-sample-type-button");
        this._codeInput = page.getByTestId("sample-type-code-input");
        this._nameInput = page.getByTestId("sample-type-name-input");
        this._tableActionButton = page.getByTestId("action-button");
        this._editActionButton = page.getByTestId("edit-sample-type");
        this._deleteActionButton = page.getByTestId("delete-sample-type");
    }

    async goto() {
        await this._page.goto(`${TEST_URL}${ROUTES.sampleTypes.route}`);
    }

    async fillSearch(codeOrName: string) {
        await this._searchInput.clear();
        await this._searchInput.fill(codeOrName);
    }

    async expectItemInTable(codeOrName: string) {
        await expect(this._page.getByText(codeOrName)).toBeVisible();
    }

    async createSampleType({ code, name }: SampleTypeFormValues) {
        await this._createSampleTypeButton.click();
        await this._codeInput.fill(code);
        await this._nameInput.fill(name);
        await this._drawer.submit();
        await this._toast.hasTitle("Sample type has been created");
        await this._toast.close();
    }

    async editSampleType(codeOrNameToFind: string, { code, name }: SampleTypeFormValues) {
        await this.fillSearch(codeOrNameToFind);
        await expectStatus(this._page, `${BE_URL}sample_types?page=1&name=${codeOrNameToFind}`, 200);
        await this.expectItemInTable(codeOrNameToFind);
        await this._tableActionButton.click();
        await this._editActionButton.click();
        await this._codeInput.fill(code);
        await this._nameInput.fill(name);
        await this._drawer.submit();
        await this._toast.hasTitle("Sample type has been edited");
        await this._toast.close();
    }

    async deleteSampleType(codeOrNameToFind: string) {
        await this.fillSearch(codeOrNameToFind);
        await expectStatus(this._page, `${BE_URL}sample_types?page=1&name=${codeOrNameToFind}`, 200);
        await this.expectItemInTable(codeOrNameToFind);
        await this._tableActionButton.click();
        await this._deleteActionButton.click();
        await this._dialog.submit();
        await this._toast.hasTitle("Sample type has been deleted");
        await this._toast.close();
    }
}
