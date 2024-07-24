import { Selector, t } from "testcafe";
import { ExaminationTemplate } from "../../../src/shared/models/business/examTemplate";
import { MOCKED_PARAMETERS } from "../../../src/testingInfrustructure/mocks/parameters";
import DialogModel from "../../components/Dialog/DialogModel";
import AddParameterDrawerModel from "../../components/drawers/AddParameterDrawer/AddParameterDrawerModel";
import DrawerModel from "../../components/drawers/Drawer/DrawerModel";
import { selectOption } from "../../utils";
import { FindParameterFormData } from "../../../src/components/ParameterDrawers/AssingOrCreateParameter/models";

enum AddParameterOptions {
    ONE,
    GROUP,
}

export class ExamTemplateModel {
    codeInput: Selector = Selector("#code");
    nameInput: Selector = Selector("#name");
    termInput: Selector = Selector("#term");
    sampleTypesSelect: Selector = Selector("#sample_types_id");
    sampleTypesSelectOption = (value: string) => selectOption(this.sampleTypesSelect, value);

    measurementUnitsSelect: Selector = Selector("#si_measurement_units_id");
    measurementUnitsSelectOption = (value: string) => selectOption(this.measurementUnitsSelect, value);
    volumeInput: Selector = Selector("#volume");
    statusesSelect: Selector = Selector("#status_id");
    statusesSelectOption = (value: string) => selectOption(this.statusesSelect, value);

    preparationTextarea: Selector = Selector("#preparation");
    descriptionTextarea: Selector = Selector("#description");
    addParameterButton: Selector = Selector("button").withAttribute("data-testid", "add-parameter-button");
    addParameterToGroupButton = (uuid: string) =>
        Selector("svg").withAttribute("data-testid", `parameter-add-icon-${uuid}`);

    deleteParameterButton = (uuid: string) =>
        Selector("svg").withAttribute("data-testid", `parameter-delete-icon-${uuid}`);

    addParametersGroupButton: Selector = Selector("button").withAttribute("data-testid", "add-parameters-group-button");
    backButton: Selector = Selector("button").withAttribute("data-testid", "cancel-stepper-button");
    continueButton: Selector = Selector("button").withAttribute("data-testid", "submit-stepper-button");

    async deleteParameter(uuid: string) {
        await t.click(this.deleteParameterButton(uuid)).click(DialogModel.submitDialogButton);
    }

    async addParameterToGroup({ parameterCodeAutocomplete }: FindParameterFormData, uuid: string) {
        await t.click(this.addParameterToGroupButton(uuid));
        await this.fillSecondStep({ parameterCodeAutocomplete }, AddParameterOptions.ONE);
    }

    async fillFirstStep({
        code,
        name,
        term,
        preparation,
        description,
        sample_types_id,
        status_id,
    }: ExaminationTemplate) {
        await t.typeText(this.codeInput, code).typeText(this.nameInput, name).typeText(this.termInput, String(term));
        await this.sampleTypesSelectOption(sample_types_id as string);
        await this.statusesSelectOption(status_id as string);
        await t
            .typeText(this.preparationTextarea, preparation ?? "")
            .typeText(this.descriptionTextarea, description ?? "");
    }

    async fillSecondStep({ parameterCodeAutocomplete }: FindParameterFormData, option: AddParameterOptions) {
        switch (option) {
            case AddParameterOptions.ONE:
                await t.click(this.addParameterButton);
                await AddParameterDrawerModel.parameterAutocompleteOption(parameterCodeAutocomplete.label);
                await t.click(DrawerModel.submitButton).click(DrawerModel.submitButton);
                await AddParameterDrawerModel.fillForm(MOCKED_PARAMETERS()[0]);
                return;
            case AddParameterOptions.GROUP:
                await t
                    .click(this.addParametersGroupButton)
                    .typeText(this.nameInput, "anyGroupName")
                    .click(DialogModel.submitDialogButton);
                return;
        }
    }

    async saveTemplate() {
        await t.click(this.continueButton);
    }
}

export default new ExamTemplateModel();
