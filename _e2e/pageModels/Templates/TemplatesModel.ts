import { Selector, t } from "testcafe";
import { TemplateTypeEnum } from "../../../src/shared/models/business/template";
import { selectOption } from "../../utils";

export class TemplatesModel {
    //filters
    searchInput: Selector = Selector("#name");
    statusesSelect: Selector = Selector("#status");
    statusesSelectOption = (value: string) => selectOption(this.statusesSelect, value);

    //actions
    createActionsButton: Selector = Selector("button").withAttribute("data-testid", "create-action-button");
    editButton: Selector = Selector("svg").withAttribute("data-testid", "template-edit-icon");
    copyButton: Selector = Selector("button").withAttribute("data-testid", "template-copy-icon");
    addActionToGroupButton: Selector = Selector("svg").withAttribute("data-testid", "template-add-actions-icon");
    deleteButton: Selector = Selector("button").withAttribute("data-testid", "template-delete-icon");
    insertButton: Selector = Selector("button").withAttribute("data-testid", "template-insert-icon");
    moveTemplateButton = (index: number) => {
        return Selector("svg").withAttribute("data-testid", `template-move-icon-${index}`);
    };

    expandAccordionButton(uuid: string) {
        return Selector("button").withAttribute("data-testid", `${uuid}-folder-icon`);
    }

    createActionButton(name: TemplateTypeEnum) {
        return Selector("li").withAttribute("data-testid", `create-${name}-action`);
    }

    groupRow(path: string) {
        return Selector("li").withAttribute("data-testid", path);
    }

    async createAction(name: TemplateTypeEnum) {
        await t.click(this.createActionsButton).click(this.createActionButton(name));
    }
}

export default new TemplatesModel();
