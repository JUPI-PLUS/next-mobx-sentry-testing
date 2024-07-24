import { Selector, t } from "testcafe";
import { KitTemplateFormFields } from "../../../src/modules/KitTemplate/components/KitForm/models";
import { selectOption } from "../../utils";

export class KitTemplateModel {
    nameInput: Selector = Selector("#name");
    codeInput: Selector = Selector("#code");
    statusesSelect: Selector = Selector("#status");
    submitFormButton: Selector = Selector("button").withAttribute("data-testid", "submit-button");
    statusesSelectOption = (value: string) => selectOption(this.statusesSelect, value);

    addExamTemplateButton: Selector = Selector("button").withAttribute("data-testid", "add-exam-template");
    examTemplateSelect: Selector = Selector("#exam_template");
    examTemplateSelectOption = (value: string) => selectOption(this.examTemplateSelect, value);

    removeExamTemplateButton(name: string) {
        return Selector("button").withAttribute("data-testid", `remove-exam-template-${name}-button`);
    }

    async fillForm(examTemplate: string, { code, name, status_id }: KitTemplateFormFields) {
        await t.typeText(this.nameInput, name).typeText(this.codeInput, code);
        await this.statusesSelectOption(status_id?.label ?? "");
        await this.examTemplateSelectOption(examTemplate);
    }

    async saveTemplate() {
        await t.click(this.submitFormButton);
    }
}

export default new KitTemplateModel();
