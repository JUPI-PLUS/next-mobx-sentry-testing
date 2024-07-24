import { Selector } from "testcafe";

export class SampleActionsDropdownModel {
    viewDetailsButton: Selector = Selector("li").withAttribute("data-testid", "sample-view-details-item");
    resampleButton: Selector = Selector("li").withAttribute("data-testid", "sample-resample-item");
    markAsDamagedButton: Selector = Selector("li").withAttribute("data-testid", "sample-mark-as-damaged-item");
    removeButton: Selector = Selector("li").withAttribute("data-testid", "sample-remove-item");
    printBarcodeLink: Selector = Selector("li").withAttribute("data-testid", "sample-print-barcode-item");
    sendToArchiveButton: Selector = Selector("li").withAttribute("data-testid", "send-to-archive-item");
}

export default new SampleActionsDropdownModel();
