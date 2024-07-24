// libs
import React, { FC } from "react";
import { DayPicker } from "react-day-picker";
import { subMonths } from "date-fns";

// models
import { DatePickerCalendarProps } from "../../models";

// constants
import { MAX_YEAR, MIN_YEAR } from "../../constants";

// components
import DayComponent from "../../DatePicker/components/DayButton";

const DatePickerCalendar: FC<Omit<DatePickerCalendarProps, "onSubmit" | "onCancel" | "onClickAway" | "inputRef">> = ({
    dateRange,
    setDate,
    disabled,
}) => {
    const defaultMonth = dateRange?.from || (Boolean(disabled) ? subMonths(new Date(), 1) : new Date());

    const onDayClick = (day: Date) => {
        if (dateRange?.from && dateRange?.to) {
            setDate({ from: day, to: undefined });
            return;
        }
    };

    return (
        <div className="date-picker" data-testid="date-range-container">
            <DayPicker
                className="m-0"
                numberOfMonths={2}
                mode="range"
                disabled={disabled}
                selected={dateRange}
                onDayClick={onDayClick}
                onSelect={setDate}
                fromYear={MIN_YEAR}
                toYear={MAX_YEAR}
                defaultMonth={defaultMonth}
                components={{
                    Day: DayComponent,
                }}
            />
        </div>
    );
};

export default DatePickerCalendar;
