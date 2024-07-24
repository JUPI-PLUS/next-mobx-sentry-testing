import { Selector, t } from "testcafe";
import { selectOption } from "../../utils";
import { SampleFilters } from "../../../src/modules/Examinations/models";
import DatepickerModel from "../../components/Datepicker/DatepickerModel";

export class ExaminationsModel {
    filterBySampleBarcodeInput: Selector = Selector("#barcode");
    filterByOrderNumberInput: Selector = Selector("#exam_order_number");
    filterByExpirationDateInput: Selector = Selector("#expired");
    filterBySampleTypeSelect: Selector = Selector("#type_id");
    filterBySampleTypeSelectOption = (value: string) => selectOption(this.filterBySampleTypeSelect, value);
    filterByExamTypeSelect: Selector = Selector("#exam_template_id");
    filterByExamTypeSelectOption = (value: string) => selectOption(this.filterByExamTypeSelect, value);

    expandFiltersButton: Selector = Selector("span").withAttribute("data-testid", "show-more-link");

    saveExaminationButton: Selector = Selector("button").withAttribute("data-testid", "save-examination-order");
    validateExaminationButton: Selector = Selector("button").withAttribute("data-testid", "validate-examination-order");

    sampleCard(sampleNumber: number) {
        return Selector("div").withAttribute("data-testid", `sample-card-${sampleNumber}`);
    }

    async fillValue(examIndex = 0, paramIndex = 0, valueIndex = 0, value = "1") {
        await t.typeText(Selector(`#${examIndex}-exams-${paramIndex}-params-${valueIndex}-value`), value);
    }

    async fillFiltersForm({
        barcode,
        exam_order_number,
        expire_date_from,
        expire_date_to,
        type_id,
        exam_template_id,
    }: SampleFilters) {
        if (barcode) {
            await t.typeText(this.filterBySampleBarcodeInput, barcode);
        }
        if (exam_order_number) {
            await t.typeText(this.filterByOrderNumberInput, exam_order_number);
        }
        if (expire_date_from || expire_date_to) {
            await DatepickerModel.filterdatepickerByCalendar(
                this.filterByExpirationDateInput,
                expire_date_from!,
                expire_date_to!
            );
        }
        if (type_id) {
            await this.filterBySampleTypeSelectOption(String(type_id[0]));
        }
        if (exam_template_id) {
            await this.filterBySampleTypeSelectOption(String(exam_template_id[0]));
        }
    }
}

export default new ExaminationsModel();
