import { format } from "date-fns";
import { DATE_FORMATS } from "../constants/formates";
import { DateRange } from "react-day-picker";

export const getDateRangeFilter = (range?: DateRange, formatter = DATE_FORMATS.DATE_FILTER) => {
    if (!range || !range.from) {
        return [];
    }

    const from = format(range.from, formatter);
    const to = range.to ? format(range.to, formatter) : from;

    return [from, to];
};

export const getValidationMessage = (filterValue: string, min: number, max?: number) => {
    const isNumberLengthValid =
        filterValue.length && filterValue.length >= min && (max ? filterValue.length <= max : true);

    if (!filterValue.length) return "";
    if (!isNumberLengthValid) return `Min symbols ${min}${max ? ` and max ${max} symbols` : ""}`;
    return "";
};
