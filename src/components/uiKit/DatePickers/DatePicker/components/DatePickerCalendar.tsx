import React, { FC, useRef } from "react";
import { DayPicker } from "react-day-picker";
import { DatePickerCalendarProps } from "../../models";
import { useClickAway } from "../../../../../shared/hooks/useClickAway";
import DayComponent from "./DayButton";
import { MIN_YEAR } from "../../constants";

const DatePickerCalendar: FC<DatePickerCalendarProps> = ({
    inputRef,
    dateRange,
    setDate,
    onClickAway,
    disabled,
    showOutsideDays,
    maxYear,
}) => {
    const ref = useRef<HTMLDivElement>(null);
    useClickAway(ref, onClickAway, inputRef);

    const onDayClick = (day: Date) => {
        setDate({ from: day, to: undefined });
    };

    return (
        <div data-testid="date-range-container" className="date-picker">
            <DayPicker
                className="m-0"
                classNames={{
                    day_range_middle: "rounded-full",
                }}
                disabled={disabled}
                selected={dateRange}
                onDayClick={onDayClick}
                onSelect={setDate}
                fromYear={MIN_YEAR}
                toYear={maxYear}
                defaultMonth={dateRange?.from || new Date()}
                captionLayout="dropdown"
                showOutsideDays={showOutsideDays}
                components={{
                    Day: DayComponent,
                }}
            />
        </div>
    );
};

export default DatePickerCalendar;
