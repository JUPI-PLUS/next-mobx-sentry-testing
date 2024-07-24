import { Selector, t } from "testcafe";
import { CreateSampleData } from "../../../src/modules/Order/components/ExaminationsTable/components/Cells/SampleNumberCell/components/SampleDropdown/models";
import DatepickerModel from "../../components/Datepicker/DatepickerModel";
import DrawerModel from "../../components/drawers/Drawer/DrawerModel";
import { selectOption, toggleCheckboxTo } from "../../utils";

export class OrderDetailsModel {
    viewProfileLink: Selector = Selector("button").withAttribute("data-testid", "view-profile-button");
    dropdownButton = (uuid: string) => Selector("div").withAttribute("data-testid", `dropdown-field-${uuid}`);
    notesTextarea = (examsIndex: number, notesIndex: number) =>
        Selector(`textarea#${examsIndex}-exams-${notesIndex}-notes`);

    addNotesButton = Selector("button").withAttribute("data-testid", "add-notes-button");

    //add sample drawer
    sampleNumberInput: Selector = Selector("#sample_number");
    datepickerInput: Selector = Selector("#sampling_datetime");

    sampleTypeSelect: Selector = Selector("#sample_type");
    sampleTypeSelectOption = (value: string) => selectOption(this.sampleTypeSelect, value);
    volumeInput: Selector = Selector("#volume");
    measureUnitSelect: Selector = Selector("#measure_unit");
    measureUnitSelectOption = (value: string) => selectOption(this.measureUnitSelect, value);
    isPrintableCheckbox: Selector = Selector("#isPrintable", { timeout: 100 });

    //sample type
    groupCheckboxParameter(id: number) {
        return Selector(`${id}-group-checkbox`);
    }

    //exam template
    checkboxParameter(name: string) {
        return Selector(`${name}-checkbox`);
    }

    async fillAddSampleForm({
        sample_type_id,
        si_measurement_units_id,
        sampling_datetime = new Date().getTime(),
        volume,
        isPrintable = false,
        shouldSubmit = true,
    }: Partial<CreateSampleData> & { isPrintable?: boolean; shouldSubmit?: boolean }) {
        await t.click(DrawerModel.submitButton);
        if (sampling_datetime) {
            await t.expect(this.datepickerInput.exists).ok().click(this.datepickerInput, { speed: 0.5 });
            await DatepickerModel.datetimepickerByCalendar(sampling_datetime);
        }
        if (sample_type_id) {
            await this.sampleTypeSelectOption(String(sample_type_id));
        }
        if (volume) {
            await t.typeText(this.volumeInput, String(volume));
        }
        if (si_measurement_units_id) {
            await this.measureUnitSelectOption(String(si_measurement_units_id));
        }
        await toggleCheckboxTo(this.isPrintableCheckbox, isPrintable);
        if (shouldSubmit) {
            await t.click(DrawerModel.submitButton);
        }
    }
}

export default new OrderDetailsModel();
