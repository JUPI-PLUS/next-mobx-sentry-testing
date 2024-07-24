import { Selector, t } from "testcafe";

export class ToastModel {
    toastTitle: Selector = Selector("h2").withAttribute("data-testid", "toast-title");
    closeToastButton: Selector = Selector("svg").withAttribute("data-testid", "toast-close-btn");

    async closeToast() {
        await t.click(this.closeToastButton);
    }

    async expectedToastTitle(title: string) {
        await t.expect(this.toastTitle.textContent).eql(title);
    }
}

export default new ToastModel();
