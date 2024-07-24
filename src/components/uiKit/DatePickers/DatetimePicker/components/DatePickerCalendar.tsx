import React, { FC } from "react";
import { DayPicker } from "react-day-picker";
import { DatePickerCalendarProps } from "../../models";
import DayComponent from "../../DatePicker/components/DayButton";
import DatetimeCaption from "./DatetimeCaption";
import { MAX_YEAR, MIN_YEAR } from "../../constants";

const DatePickerCalendar: FC<Omit<DatePickerCalendarProps, "onSubmit" | "onCancel" | "onClickAway" | "inputRef">> = ({
    dateRange,
    setDate,
    disabled,
}) => {
    const onDayClick = (day: Date) => {
        setDate({ from: day });
    };

    return (
        <div className="date-picker date-time-picker" data-testid="date-range-container">
            <DayPicker
                className="m-0"
                disabled={disabled}
                selected={dateRange}
                onDayClick={onDayClick}
                onSelect={setDate}
                fromYear={MIN_YEAR}
                toYear={MAX_YEAR}
                defaultMonth={dateRange?.from || new Date()}
                components={{
                    Day: DayComponent,
                    Caption: DatetimeCaption,
                }}
            />
        </div>
    );
};

export default DatePickerCalendar;
