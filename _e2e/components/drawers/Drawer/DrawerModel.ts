import { Selector } from "testcafe";

export class DrawerModel {
    closeButton: Selector = Selector("button").withAttribute("data-testid", "close-dialog-button");
    submitButton: Selector = Selector("button").withAttribute("data-testid", "submit-drawer-button");
}

export default new DrawerModel();
