import { Selector, t } from "testcafe";
import AddParameterDrawerModel from "../../components/drawers/AddParameterDrawer/AddParameterDrawerModel";
import { MOCKED_PARAMETERS } from "../../../src/testingInfrustructure/mocks/parameters";

const parameter = MOCKED_PARAMETERS()[0];

export class ParametersModel {
    searchInput: Selector = Selector("#code");
    createParameterButton: Selector = Selector("button").withAttribute("data-testid", "create-parameter-button");

    //actions
    actionButton: Selector = Selector("svg").withAttribute("data-testid", "action-button");
    editButton: Selector = Selector("li").withAttribute("data-testid", "edit-option");
    deleteButton: Selector = Selector("li").withAttribute("data-testid", "delete-option");

    async addParameter() {
        await t.click(this.createParameterButton);
        await AddParameterDrawerModel.fillForm(parameter);
    }
}

export default new ParametersModel();
