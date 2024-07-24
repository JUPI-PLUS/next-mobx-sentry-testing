import React, { FC, useRef, useState } from "react";
import Popper from "../../Popper/Popper";
import { useDisclosure } from "../../../../shared/hooks/useDisclosure";
import { format } from "date-fns";
import { useClickAway } from "../../../../shared/hooks/useClickAway";
import Select from "../../forms/selects/Select/Select";
import DatePickerCalendar from "./components/DatePickerCalendar";
import { HOURS_OPTIONS, MINUTES_OPTIONS } from "./constants";
import { DatetimePickerProps, TimeSelectValue } from "./models";
import { getTimestampFromDatetimePicker } from "./utils";
import DatePickerFooter from "../components/DatePickerFooter";
import useSelectedDateRange from "../hooks/useSelectedDateRange";
import { getFormattedDate, isDateInputted, isMaskDateValid, onDatePickerInputComplete } from "../utils";
import DatePickerInput from "../components/DatePickerInput";
import { DATE_TIME_MASK_OPTIONS } from "../constants";
import { DATE_FORMATS } from "../../../../shared/constants/formates";
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";

const DatetimePicker: FC<DatetimePickerProps> = ({
    name,
    date,
    value,
    placeholder,
    onChange,
    label,
    disabledDate,
    disabled,
    popperPlacement = "bottom",
    offsetDistance = 10,
    offsetSkidding = 70,
    popperClassName,
    errorMessage,
    isFilter = false,
    formRef,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState(value || "");
    const [selectedHours, setSelectedHours] = useState<TimeSelectValue>(HOURS_OPTIONS[0]);
    const [selectedMinutes, setSelectedMinutes] = useState<TimeSelectValue>(MINUTES_OPTIONS[0]);
    const [errorMessageValue, setErrorMessageValue] = useState<string | undefined>(errorMessage);
    const { setSelectedDateRange, selectedDateRange, onReset: onResetDate } = useSelectedDateRange(date);
    const ref = useRef<HTMLDivElement>(null);

    const onDateRangeCancel = () => {
        onClose();
        focusInputOnCloseCalendar();
        if (!inputValue) setSelectedDateRange(undefined);
    };

    const onSelectDateRange = () => {
        onClose();
        focusInputOnCloseCalendar();
        setSelectedDateRange(selectedDateRange);

        onChange?.(
            selectedDateRange,
            `${selectedHours}:${selectedMinutes}`,
            getTimestampFromDatetimePicker(selectedDateRange, selectedHours.value, selectedMinutes.value)
        );
        setInputValue(
            getFormattedDate(selectedDateRange, {
                hours: selectedHours.value,
                minutes: selectedMinutes.value,
            })
        );
        setErrorMessageValue("");
    };

    const setVisibility = () => {
        isOpen ? onClose() : onOpen();
    };

    const onReset = () => {
        setInputValue("");
        setSelectedDateRange(undefined);
        onChange?.({ from: undefined });
    };

    const onBlur = () => {
        isOpen && onClose();
    };

    const focusInputOnCloseCalendar = () => {
        // We need to setup focus on datepicker input when calendar was closed.
        // Cause of react-hook-form also need ref on input control,
        // we do not have any another way to setup focus instead of querying by dom api
        inputRef.current?.querySelector("input")?.focus();
    };

    // useEffect(() => {
    //     const today = new Date();
    //     const hours = format(date?.from ?? today, "hh");
    //     const minutes = format(date?.from ?? today, "mm");
    //
    //     setSelectedDateRange(date || { from: today });
    //     setSelectedHours(HOURS_OPTIONS.find(hr => hr.value === hours)!);
    //     setSelectedMinutes(MINUTES_OPTIONS.find(mn => mn.value === minutes)!);
    //
    //     const now = format(today, DATE_FORMATS.DATETIME_PICKER_VALUE);
    //     setInputValue(value || now);
    // }, [date, value]);

    useClickAway(ref, onDateRangeCancel, inputRef);

    const onInputAccept = (maskedValue: string) => {
        const isDateExists = isDateInputted(maskedValue);
        if (isDateExists) {
            const [maskedDate, maskedTime] = maskedValue.split(" ");
            const isDateFilled = maskedDate?.match(/\d/g)?.length === 8;
            const isTimeFilled = maskedTime?.match(/\d/g)?.length === 4;

            if (isDateFilled || !isMaskDateValid(maskedDate, DATE_FORMATS.DATE_ONLY)) {
                setErrorMessageValue(VALIDATION_MESSAGES.ENTER_VALID("date and time"));
                onChange?.();
                return;
            } else {
                setErrorMessageValue(undefined);
            }
            if (isTimeFilled || !isMaskDateValid(maskedTime, DATE_FORMATS.TIME_ONLY)) {
                setErrorMessageValue(VALIDATION_MESSAGES.ENTER_VALID("time"));
                onChange?.();
                return;
            } else {
                setErrorMessageValue(undefined);
            }
        } else {
            onReset();
        }
    };

    const onInputComplete = (maskedValue: string) => {
        const result = onDatePickerInputComplete(maskedValue, DATE_FORMATS.DATETIME_PICKER_VALUE);
        if (result) {
            onClose();
            focusInputOnCloseCalendar();
            setSelectedDateRange(result);
            setErrorMessageValue(undefined);

            const inputtedHours = format(result.from!, "HH");
            const inputtedMinutes = format(result.from!, "mm");

            setSelectedHours(HOURS_OPTIONS.find(hr => hr.value === inputtedHours)!);
            setSelectedMinutes(MINUTES_OPTIONS.find(min => min.value === inputtedMinutes)!);

            onChange?.(
                result,
                `${inputtedHours}:${inputtedMinutes}`,
                getTimestampFromDatetimePicker(result, inputtedHours, inputtedMinutes)
            );
            setInputValue(maskedValue);
        }
    };

    return (
        <>
            <div>
                <div>
                    <DatePickerInput
                        options={DATE_TIME_MASK_OPTIONS}
                        onAccept={onInputAccept}
                        onComplete={onInputComplete}
                        ref={inputRef}
                        value={inputValue}
                        toggleCalendarVisibility={setVisibility}
                        onReset={onReset}
                        onBlur={onBlur}
                        name={name}
                        label={label}
                        placeholder={placeholder}
                        disabled={disabled}
                        errorMessage={errorMessageValue || errorMessage}
                        isFilter={isFilter}
                        formRef={formRef}
                    />
                </div>
            </div>
            <Popper
                onClose={onClose}
                isOpen={isOpen}
                sourceRef={inputRef}
                placement={popperPlacement}
                offsetDistance={offsetDistance}
                offsetSkidding={offsetSkidding}
                className={popperClassName}
            >
                <div ref={ref} className="w-full max-w-md">
                    <div className="shadow-datepicker rounded-xl border border-inset border-dark-400 bg-white flex w-full">
                        <div className="w-full">
                            <div>
                                <div className="py-3 px-6">
                                    <DatePickerCalendar
                                        dateRange={selectedDateRange}
                                        setDate={setSelectedDateRange}
                                        disabled={disabledDate}
                                    />
                                </div>
                                <div className="flex justify-between pb-4 px-6">
                                    <div className="max-w-1/2 w-full mr-3">
                                        <Select
                                            name="hours_select"
                                            options={HOURS_OPTIONS}
                                            value={selectedHours}
                                            onChange={newValue => newValue && setSelectedHours(newValue)}
                                        />
                                    </div>
                                    <div className="max-w-1/2 w-full">
                                        <Select
                                            name="minutes_select"
                                            options={MINUTES_OPTIONS}
                                            value={selectedMinutes}
                                            onChange={newValue => newValue && setSelectedMinutes(newValue)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <DatePickerFooter
                                onReset={onResetDate}
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

export default DatetimePicker;
