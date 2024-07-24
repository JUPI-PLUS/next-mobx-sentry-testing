import { Locator, Page } from "playwright-core";
import { expect } from "@playwright/test";
import { expectStatus, selectOption } from "../helpers";
import { ToastModel } from "../componentModels/ToastModel";
import { DialogModel } from "../componentModels/DialogModel";
import { TEST_URL } from "../constants";
import { ROUTES } from "../../src/shared/constants/routes";

export interface ExperimentalWorkplaceFormValues {
    code: string;
    name: string;
    status: number;
    notes?: string;
    examTemplates: string[];
}

export class WorkplaceFormModel {
    private readonly _page: Page;

    // UI Element
    private readonly _breadcrumb: Locator;

    // form
    private readonly _nameInput: Locator;
    private readonly _codeInput: Locator;
    private readonly _statusSelect: Locator;
    private readonly _notesTextarea: Locator;
    private readonly _examTemplateAutocomplete: Locator;
    private readonly _removeExamTemplateButton: Locator;
    private readonly _addExamTemplateButton: Locator;
    private readonly _submitButton: Locator;

    constructor(page: Page) {
        this._page = page;

        this._breadcrumb = page.getByTestId("breadcrumbsLabel");

        this._nameInput = page.getByTestId("workplace-name-input");
        this._codeInput = page.getByTestId("workplace-code-input");
        this._statusSelect = page.getByLabel("Status");
        this._notesTextarea = page.locator(".ql-editor");
        this._examTemplateAutocomplete = page.getByLabel("Exam template name");
        this._removeExamTemplateButton = page.getByTestId("remove-exam-template-button");
        this._addExamTemplateButton = page.getByTestId("add-exam-template");

        this._submitButton = page.getByTestId("submit-button");
    }

    async isLoaded() {
        await expect(this._breadcrumb).toBeVisible();
    }

    async submit() {
        await this._submitButton.click();
    }

    async fill({ name, code, status, notes, examTemplates }: ExperimentalWorkplaceFormValues) {
        await this._nameInput.fill(name);
        await this._codeInput.fill(code);
        await selectOption(this._page, this._statusSelect, status);
        if (notes) await this._notesTextarea.fill(notes);
        for (let i = 0; i < examTemplates.length; i++) {
            if (i !== 0) await this._addExamTemplateButton.click();
            await this._examTemplateAutocomplete.fill(examTemplates[i]);
            await expectStatus(this._page, /exam_templates/gi, 200);
            await this._page.keyboard.press("Enter");
        }
    }

    async removeExamTemplates() {
        await expect(this._removeExamTemplateButton.nth(0)).toBeVisible();
        const examTemplates = await this._removeExamTemplateButton.count();
        for (let i = 0; i < examTemplates; i++) {
            await this._removeExamTemplateButton.nth(0).click();
        }
    }
}

export class WorkplacesModel {
    private readonly _page: Page;

    // UI Elements
    private readonly _toast: ToastModel;
    private readonly _dialog: DialogModel;

    // WP form
    private readonly _WPForm: WorkplaceFormModel;

    // page controls
    private readonly _searchInput: Locator;
    private readonly _examTypeSelect: Locator;
    private readonly _createWorkplaceButton: Locator;

    // table actions
    private readonly _actionButton: Locator;
    private readonly _editButton: Locator;
    private readonly _deleteButton: Locator;

    constructor(page: Page) {
        this._page = page;

        this._toast = new ToastModel(page);
        this._dialog = new DialogModel(page);
        this._WPForm = new WorkplaceFormModel(page);

        this._searchInput = page.getByTestId("search-string-filter-input");
        this._examTypeSelect = page.getByPlaceholder("Exam type");
        this._createWorkplaceButton = page.getByTestId("create-workplace-button");

        this._actionButton = page.getByTestId("action-button");
        this._editButton = page.getByTestId("edit-workplace");
        this._deleteButton = page.getByTestId("delete-workplace");
    }

    async goto() {
        await this._page.goto(`${TEST_URL}${ROUTES.workplaces.route}`);
    }

    async find({
        nameOrCode,
        examTypes,
        expectedWPName,
    }: {
        expectedWPName: string;
        nameOrCode?: string;
        examTypes?: number[];
    }) {
        if (nameOrCode) {
            await this._searchInput.clear();
            await this._searchInput.fill(nameOrCode);
            await expectStatus(this._page, new RegExp(`search_string=${nameOrCode}`, "gi"), 200);
        }
        if (examTypes?.length) {
            for (const examType of examTypes) {
                await selectOption(this._page, this._examTypeSelect, examType);
            }
            await expectStatus(this._page, /exam_template_id\[\]=\d/gi, 200);
        }
        await expect(this._page.getByRole("cell", { name: expectedWPName })).toBeVisible();
    }

    async create(values: ExperimentalWorkplaceFormValues) {
        await expect(this._createWorkplaceButton).toBeEnabled();
        await expect(this._createWorkplaceButton).toBeVisible();
        await this._createWorkplaceButton.click();
        await this._WPForm.isLoaded();
        await this._WPForm.fill(values);
        await this._WPForm.submit();
        await this._toast.hasTitle("Workplace has been created");
        await this._toast.close();
    }

    async edit(name: string, values: ExperimentalWorkplaceFormValues) {
        await this.find({ nameOrCode: name, expectedWPName: name });
        await this._actionButton.click();
        await this._editButton.click();
        await this._WPForm.isLoaded();
        await this._WPForm.removeExamTemplates();
        await this._WPForm.fill(values);
        await this._WPForm.submit();
        await this._toast.hasTitle("Workplace has been updated");
        await this._toast.close();
        await this.find({ nameOrCode: values.name, expectedWPName: values.name });
    }

    async delete(name: string) {
        await this.find({ nameOrCode: name, expectedWPName: name });
        await this._actionButton.click();
        await this._deleteButton.click();
        await this._dialog.submit();
        await expectStatus(
            this._page,
            /workplaces\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\/exam_templates/i,
            200
        );
        await this._WPForm.removeExamTemplates();
        await this._WPForm.submit();
        await this._toast.hasTitle("Workplace has been updated");
        await this._toast.close();
        await this._toast.isHidden();
        await this._actionButton.click();
        await this._deleteButton.click();
        await this._dialog.submit();
        await this._toast.hasTitle("Workplace has been deleted");
        await this._toast.close();
    }
}
