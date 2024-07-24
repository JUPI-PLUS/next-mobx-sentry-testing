import { Selector, t } from "testcafe";
import { selectOption, toggleCheckboxTo } from "../../utils";
import { User, StaffInfo } from "../../../src/shared/models/business/user";
import DatepickerModel from "../../components/Datepicker/DatepickerModel";

export class PatientProfileModel {
    //profile fields
    firstNameInput: Selector = Selector("#first_name");
    lastNameInput: Selector = Selector("#last_name");
    sexSelect: Selector = Selector("#sex");
    sexSelectOption = (value: string) => selectOption(this.sexSelect, value);
    birthdaySelect: Selector = Selector("#birth_date");
    emailInput: Selector = Selector("#email");
    makeAStaffToggle: Selector = Selector("#isMakeAStaff");

    //staff fields
    organizationSelect: Selector = Selector("#organization");
    organizationSelectOption = (value: string) => selectOption(this.organizationSelect, value);
    positionSelect: Selector = Selector("#position");
    positionSelectOption = (value: string) => selectOption(this.positionSelect, value);
    submitFormButton: Selector = Selector("#submit-dialog-button");

    //profile
    avatarDropdownButton: Selector = Selector("div").withAttribute("data-testid", "avatar-container");
    avatarDropdownMenuItem: Selector = Selector("li").withAttribute("data-testid", "profile-settings-menu-item");

    async submitForm() {
        await t.click(this.submitFormButton);
    }

    async fillForm({ first_name, last_name, sex_id, birth_date }: User) {
        await t
            .typeText(this.firstNameInput, first_name ?? "", { replace: true })
            .typeText(this.lastNameInput, last_name ?? "", { replace: true });
        await selectOption(this.sexSelect, String(sex_id));
        await DatepickerModel.datepickerByCalendar(new Date(birth_date ?? 0));
    }

    async makeAStaff(flag = true) {
        await toggleCheckboxTo(this.makeAStaffToggle, flag);
    }

    async fillStaffFields({ organization_id, position_id }: StaffInfo) {
        await this.organizationSelectOption(String(organization_id));
        await this.positionSelectOption(String(position_id));
    }
}

export default new PatientProfileModel();
