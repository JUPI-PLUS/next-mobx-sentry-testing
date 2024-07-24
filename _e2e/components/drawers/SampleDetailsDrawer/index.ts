import { Selector } from "testcafe";
import { DrawerModel } from "../Drawer/DrawerModel";

export class SampleDetailsDrawerModel extends DrawerModel {
    printButton: Selector = Selector("button").withAttribute("data-testid", "print-button");
}

export default new SampleDetailsDrawerModel();
