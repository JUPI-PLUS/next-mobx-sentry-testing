import { addMinutes, differenceInDays, differenceInYears, fromUnixTime, format, addSeconds } from "date-fns";

// Add timestamp to output correct data
export function addOffsetToUtcDate(date: Date | number | string): Date {
    const dateSource = new Date(date);

    return addMinutes(dateSource, dateSource.getTimezoneOffset());
}

// Remove timestamp to send correct data to server
export function removeOffsetFromDate(date: Date | number | string): Date {
    const dateSource = new Date(date);

    return addMinutes(dateSource, -dateSource.getTimezoneOffset());
}

export function toUnixTimestamp(date: Date) {
    return Math.floor(
        new Date(
            Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes())
        ).getTime() / 1000
    );
}

export const addSecondsToDateNow = (seconds: number): number => addSeconds(Date.now(), seconds).getTime();

export const fromSecTimestampToMs = (timestamp: number) => timestamp * 1000;

export const fromMsToDuration = (timestamp: number) => format(timestamp, "mm:ss");

export const getPatientAge = (birthDate: number, dateMeasureUnit: "years" | "days") => {
    switch (dateMeasureUnit) {
        case "years":
            return differenceInYears(new Date(), addOffsetToUtcDate(fromUnixTime(birthDate)));
        case "days":
            return differenceInDays(new Date(), addOffsetToUtcDate(fromUnixTime(birthDate)));
    }
};
