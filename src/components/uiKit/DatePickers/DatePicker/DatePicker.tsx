import React, { FC } from "react";
import { DatePickerProps } from "../models";
import Popper from "../../Popper/Popper";
import DatePickerInput from "../components/DatePickerInput";
import DatePickerCalendar from "./components/DatePickerCalendar";
import { useDatePicker } from "../hooks/useDatePicker";
import { isMaskDateValid, onDatePickerInputComplete } from "../utils";
import DatePickerFooter from "../components/DatePickerFooter";
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";
import { MAX_YEAR } from "../constants";

const DatePicker: FC<DatePickerProps> = ({
    name,
    date,
    value,
    placeholder,
    onChange,
    label,
    disabledDate,
    disabled,
    showOutsideDays,
    popperPlacement = "bottom-start",
    offsetSkidding = 0,
    offsetDistance = 5,
    errorMessage: formErrorMessage,
    isFilter = false,
    formRef,
    maxYear = MAX_YEAR,
}) => {
    const {
        inputValue,
        inputRef,
        popoverRef,
        isOpen,
        onClose,
        toggle,
        selectedDateRange,
        setSelectedDateRange,
        onDateRangeCancel,
        onSelectDateRange,
        onCompleteInputDateRange,
        onReset,
        onBlur,
        errorMessage,
        setErrorMessage,
    } = useDatePicker({ onChange, defaultDate: date, defaultValue: value });

    const onDateInputComplete = (maskedValue: string) => {
        const result = onDatePickerInputComplete(maskedValue);
        if (result) {
            onCompleteInputDateRange(result);
        }
    };

    const onDateInputAccept = (maskedValue: string) => {
        const isFromDateExists = maskedValue?.match(/\d/g)?.length === 8;

        if (isFromDateExists) {
            setErrorMessage(!isMaskDateValid(maskedValue) ? VALIDATION_MESSAGES.ENTER_VALID("date") : undefined);
        }
    };

    return (
        <>
            <div>
                <DatePickerInput
                    ref={inputRef}
                    value={inputValue}
                    toggleCalendarVisibility={toggle}
                    onReset={onReset}
                    onBlur={onBlur}
                    name={name}
                    label={label}
                    placeholder={placeholder}
                    disabled={disabled}
                    onComplete={onDateInputComplete}
                    onAccept={onDateInputAccept}
                    errorMessage={errorMessage || formErrorMessage}
                    isFilter={isFilter}
                    formRef={formRef}
                />
            </div>
            <Popper
                isOpen={isOpen}
                sourceRef={inputRef}
                onClose={onClose}
                placement={popperPlacement}
                offsetSkidding={offsetSkidding}
                offsetDistance={offsetDistance}
            >
                <div ref={popoverRef}>
                    <div className="shadow-datepicker border border-inset border-dark-400 rounded-xl bg-white flex">
                        <div>
                            <div className="py-4 px-6">
                                <DatePickerCalendar
                                    inputRef={inputRef}
                                    onClickAway={onDateRangeCancel}
                                    dateRange={selectedDateRange}
                                    setDate={setSelectedDateRange}
                                    disabled={disabledDate}
                                    showOutsideDays={showOutsideDays}
                                    maxYear={maxYear}
                                />
                            </div>
                            <DatePickerFooter
                                onReset={onReset}
                                onCancel={onDateRangeCancel}
                                onSubmit={onSelectDateRange}
                            />
                        </div>
                    </div>
                </div>
            </Popper>
        </>
    );
};

export default DatePicker;
