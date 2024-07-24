import { Selector, t } from "testcafe";
import { SampleChangeStatusFormFields } from "../../../../src/modules/Order/components/ExaminationsTable/components/Cells/SampleNumberCell/components/SampleDropdown/models";
import DrawerModel, { DrawerModel as ExtendableDrawerModel } from "../Drawer/DrawerModel";
import DatepickerModel from "../../Datepicker/DatepickerModel";

export class MarkAsDamagedDrawerModel extends ExtendableDrawerModel {
    markAsDamagedDatepicker: Selector = Selector("#updated_at");
    damageReasonTextarea: Selector = Selector("#damage_reason");

    async fillForm({ damage_reason, updated_at }: SampleChangeStatusFormFields) {
        await t.click(this.markAsDamagedDatepicker, { speed: 0.5 });
        await DatepickerModel.datetimepickerByCalendar(updated_at.from);
        await t.typeText(this.damageReasonTextarea, String(damage_reason)).click(DrawerModel.submitButton);
    }
}

export default new MarkAsDamagedDrawerModel();
