import { format, getHours, getMinutes, getMonth, getYear } from "date-fns";
import { Selector, t } from "testcafe";
import { DATE_FORMATS } from "../../../src/shared/constants/formates";
import { selectOption } from "../../utils";

export type DateOrNumber = Date | number;

export class DatepickerModel {
    submitButton: Selector = Selector("button").withAttribute("data-testid", "date-picker-submit-button");
    cancelButton: Selector = Selector("button").withAttribute("data-testid", "date-picker-cancel-button");
    resetButton: Selector = Selector("p").withAttribute("data-testid", "reset-datepicker-button");
    clearButton = (name: string) => Selector("svg").withAttribute("data-testid", `${name}-reset-calendar-value-icon`);

    // general utils
    formatDateForDatepicker(date: DateOrNumber) {
        return format(date, DATE_FORMATS.DATE_ONLY);
    }

    dayButtonByDate = (date: DateOrNumber) => {
        return Selector("button").withAttribute("data-testid", this.formatDateForDatepicker(date));
    };

    currentDayButton() {
        return this.dayButtonByDate(new Date());
    }

    // Datepicker
    async datepickerByCalendar(date: DateOrNumber) {
        const year = getYear(date);
        const month = getMonth(date) - 1;

        const monthsSelector = Selector(".rdp-dropdown_month select.rdp-dropdown");
        await selectOption(monthsSelector, String(month));
        const yearsSelector = Selector(".rdp-dropdown_year select.rdp-dropdown");
        await selectOption(yearsSelector, String(year));

        const dateButton = this.dayButtonByDate(date);
        await t.click(dateButton);
    }

    async datepickerByInput(selector: Selector, date: string) {
        await t.typeText(selector, date, { replace: true });
    }

    // Datetimepicker
    async datetimepickerByCalendar(date: DateOrNumber) {
        const hours = getHours(date);
        const minutes = getMinutes(date);

        const dateButton = this.dayButtonByDate(date);
        await t.click(dateButton);
        await selectOption(Selector("#hours_select"), String(hours));
        await selectOption(Selector("#minutes_select"), String(minutes));
        await t.click(this.submitButton);
    }

    // Filterdatepicker
    async filterdatepickerByCalendar(selector: Selector, startDate: DateOrNumber, endDate?: DateOrNumber) {
        await t.click(selector);

        const startDateButton = this.dayButtonByDate(startDate);

        await t.click(startDateButton);
        if (endDate) {
            const endDateButton = this.dayButtonByDate(endDate);
            await t.click(endDateButton);
        }
    }
}

export default new DatepickerModel();
