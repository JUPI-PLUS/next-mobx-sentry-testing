import { Selector, t } from "testcafe";
import { selectOption, toggleCheckboxTo } from "../../../utils";
import DrawerModel from "../Drawer/DrawerModel";
import { Parameter } from "../../../../src/shared/models/business/parameter";

type AddFormParameterData = Pick<
    Parameter,
    | "code"
    | "name"
    | "biological_reference_intervals"
    | "notes"
    | "is_printable"
    | "is_required"
    | "si_measurement_units_id"
    | "type_id"
>;

export class AddParameterDrawerModel {
    parameterAutocomplete: Selector = Selector("#parameterCodeAutocomplete");
    parameterAutocompleteOption = (value: string) => selectOption(this.parameterAutocomplete, value);
    codeInput: Selector = Selector("#code");
    nameInput: Selector = Selector("#name");
    measureUnitSelect: Selector = Selector("#measure_id");
    measureUnitSelectOption = (value: string) => selectOption(this.measureUnitSelect, value);
    biologicalIntervals: Selector = Selector("#biological_reference_intervals");
    resultTypeSelect: Selector = Selector("#type_view_id");
    resultTypeSelectOption = (value: string) => selectOption(this.resultTypeSelect, value);
    notesTextarea: Selector = Selector("#notes");
    isPrintableCheckbox: Selector = Selector("#is_printable");
    isRequiredCheckbox: Selector = Selector("#is_required");

    async fillForm({
        code,
        name,
        biological_reference_intervals,
        notes,
        is_printable,
        is_required,
        si_measurement_units_id,
        type_id,
    }: AddFormParameterData) {
        await t.typeText(this.codeInput, code).typeText(this.nameInput, name);
        await this.measureUnitSelectOption(String(si_measurement_units_id) ?? "0");
        await t.typeText(this.biologicalIntervals, biological_reference_intervals);
        await this.resultTypeSelectOption(String(type_id) ?? "0");
        await t.typeText(this.notesTextarea, notes ?? "");
        await toggleCheckboxTo(this.isPrintableCheckbox, is_printable);
        await toggleCheckboxTo(this.isRequiredCheckbox, is_required);
        await t.click(DrawerModel.submitButton);
    }
}

export default new AddParameterDrawerModel();
