import { Selector } from "testcafe";

export class DialogModel {
    submitDialogButton: Selector = Selector("button").withAttribute("data-testid", "submit-dialog-button");
    dialogSubmitButton: Selector = Selector("button").withAttribute("data-testid", "submit-dialog-button");
    cancelButton: Selector = Selector("button").withAttribute("data-testid", "cancel-dialog-button");
    closeButton: Selector = Selector("button").withAttribute("data-testid", "close-dialog-button");
}

export default new DialogModel();
