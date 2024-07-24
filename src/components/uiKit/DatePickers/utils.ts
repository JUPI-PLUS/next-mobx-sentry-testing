import { DateRange } from "react-day-picker";
import { format, fromUnixTime, isValid, parse } from "date-fns";
import { DATE_FORMATS } from "../../../shared/constants/formates";
import { Dispatch, SetStateAction } from "react";
import { addOffsetToUtcDate } from "../../../shared/utils/date";

interface TimeRecord {
    hours: string;
    minutes: string;
}

export const getFormattedDate = (range: DateRange | undefined, time?: TimeRecord): string => {
    if (!range || !range.from) return "";

    const formattedFrom = format(range.from!, DATE_FORMATS.DATE_ONLY);
    const formattedTo = range.to ? format(range.to, DATE_FORMATS.DATE_ONLY) : "";
    const resultTail = formattedTo ? `- ${formattedTo}` : "";

    if (time) {
        return `${formattedFrom} ${resultTail}${time.hours}:${time.minutes}`;
    }

    return `${formattedFrom} ${resultTail}`;
};

export const isDateInputted = (value: string) => /\d/g.test(value);

export const isRangeDateExists = (value: string): (string | undefined)[] => {
    return value.split("-").map(it => {
        const trimmed = it.trim();
        return isDateInputted(trimmed) ? trimmed : undefined;
    });
};

export const isMaskDateValid = (value: string, dateFormat: string = DATE_FORMATS.DATE_ONLY): Date | undefined => {
    const parsed = parse(value, dateFormat, new Date());
    return isValid(parsed) ? parsed : undefined;
};

export const onDatePickerInputComplete = (
    value: string,
    dateFormat: string = DATE_FORMATS.DATE_ONLY
): DateRange | undefined => {
    const result: DateRange = { from: undefined, to: undefined };
    const parsedFrom = isMaskDateValid(value, dateFormat);

    if (!parsedFrom) {
        return;
    }

    result.from = parsedFrom;

    return result;
};

export const onDateRangePickerInputComplete = (
    value: string,
    setError?: Dispatch<SetStateAction<boolean>>
): DateRange => {
    const result: DateRange = { from: undefined, to: undefined };
    const [from, to] = isRangeDateExists(value);

    if (!from && !to) {
        return result;
    }

    const parsedFrom = isMaskDateValid(from!);
    const parsedTo = isMaskDateValid(to!);

    if (!parsedFrom) {
        setError?.(true);
        return result;
    } else {
        setError?.(false);
    }

    result.from = parsedFrom;

    result.to = parsedTo || parsedFrom;

    return result;
};

export const getCurrentTime = () => new Date().getTime();

export const getCalendarDefaultValue = ({ from, to }: { from?: number | null; to?: number | null }) => {
    return {
        from: from ? addOffsetToUtcDate(fromUnixTime(from)) : undefined,
        to: to ? addOffsetToUtcDate(fromUnixTime(to)) : undefined,
    };
};
