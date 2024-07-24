import React, { FC, useEffect } from "react";
import { DatePickerProps } from "../models";
import Popper from "../../Popper/Popper";
import DatePickerInput from "../components/DatePickerInput";
import DatePickerCalendar from "./components/DatePickerCalendar";
import DatePickerFooter from "../components/DatePickerFooter";
import { useDatePicker } from "../hooks/useDatePicker";
import { isMaskDateValid, isRangeDateExists, onDateRangePickerInputComplete } from "../utils";
import { DATE_RANGE_MASK_OPTIONS } from "../constants";
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";
import { isAfter, parse } from "date-fns";
import { DATE_FORMATS } from "../../../../shared/constants/formates";

const FilterDatePicker: FC<DatePickerProps> = ({
    name,
    date,
    value,
    placeholder,
    onChange,
    label,
    disabledDate,
    disabled,
    shouldReset,
    popperPlacement = "bottom-start",
    isFilter,
    formRef,
}) => {
    const {
        inputValue,
        inputRef,
        popoverRef,
        isOpen,
        onClose,
        toggle,
        selectedDateRange,
        onReset,
        onBlur,
        onCompleteInputDateRange,
        setSelectedDateRange,
        onDateRangeCancel,
        onSelectDateRange,
        errorMessage,
        setErrorMessage,
    } = useDatePicker({ onChange, defaultDate: date, defaultValue: value });

    const onDateInputAccept = (maskedValue: string): boolean => {
        const [from, to] = isRangeDateExists(maskedValue);

        if (!from && !to) {
            return false;
        }

        const isFromDateExists = from?.match(/\d/g)?.length === 8;
        const isToDateExists = to?.match(/\d/g)?.length === 8;

        if (isFromDateExists) {
            if (!isMaskDateValid(from!)) {
                setErrorMessage(VALIDATION_MESSAGES.ENTER_VALID("date"));
                return false;
            }
        }

        if (isToDateExists) {
            if (!isMaskDateValid(to!)) {
                setErrorMessage(!isMaskDateValid(to!) ? VALIDATION_MESSAGES.ENTER_VALID("date") : undefined);
                return false;
            }
        }

        if (isAfter(parse(from!, DATE_FORMATS.DATE_ONLY, new Date()), parse(to!, DATE_FORMATS.DATE_ONLY, new Date()))) {
            setErrorMessage(VALIDATION_MESSAGES.SHOULD_BE_GREATER_THAT("End date", "start date"));
            return false;
        }

        setErrorMessage("");
        return true;
    };

    const onDateInputComplete = (maskedValue: string) => {
        if (!onDateInputAccept(maskedValue)) return;
        onCompleteInputDateRange(onDateRangePickerInputComplete(maskedValue));
    };

    useEffect(() => {
        if (shouldReset) {
            onReset();
        }
    }, [shouldReset]);

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
                    errorMessage={errorMessage}
                    options={DATE_RANGE_MASK_OPTIONS}
                    isFilter={isFilter}
                    formRef={formRef}
                />
            </div>
            <Popper
                onClose={onClose}
                isOpen={isOpen}
                sourceRef={inputRef}
                placement={popperPlacement}
                offsetDistance={5}
                className="z-20"
            >
                <div ref={popoverRef}>
                    <div className="shadow-datepicker rounded-xl border border-inset border-dark-400 bg-white flex">
                        <div>
                            <div className="py-4 px-6">
                                <DatePickerCalendar
                                    dateRange={selectedDateRange}
                                    setDate={setSelectedDateRange}
                                    disabled={disabledDate}
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

export default FilterDatePicker;
