import { format, parse } from "date-fns";
import { DATE_FORMATS } from "../../../../shared/constants/formates";
import { DateRange } from "react-day-picker";

export const getTimestampFromDatetimePicker = (date: DateRange | undefined, hours: string, minutes: string): number => {
    if (!date || !date.from) {
        return new Date().getTime();
    }

    return parse(
        `${format(date!.from!, DATE_FORMATS.DATE_ONLY)} ${hours}:${minutes}`,
        DATE_FORMATS.DATETIME_PICKER_VALUE,
        new Date()
    ).getTime();
};
