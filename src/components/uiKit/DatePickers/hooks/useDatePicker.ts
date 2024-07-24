import { useDisclosure } from "../../../../shared/hooks/useDisclosure";
import { useEffect, useRef, useState } from "react";
import useSelectedDateRange from "./useSelectedDateRange";
import { DateRange } from "react-day-picker";
import { getFormattedDate } from "../utils";
import { useClickAway } from "../../../../shared/hooks/useClickAway";
import { isSameDay } from "date-fns";

interface UseDatePickerProps {
    defaultValue?: string;
    defaultDate?: DateRange;
    onChange?: (range?: DateRange) => void;
}

export const useDatePicker = ({ defaultValue, defaultDate, onChange }: UseDatePickerProps) => {
    const [errorMessage, setErrorMessage] = useState<string | undefined>();
    const { isOpen, onClose, toggle } = useDisclosure();
    const inputRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState(defaultValue || "");
    const { setSelectedDateRange, selectedDateRange, onReset: onResetDate } = useSelectedDateRange(defaultDate);
    const ref = useRef<HTMLDivElement>(null);

    const focusInputOnCloseCalendar = () => {
        // We need to setup focus on datepicker input when calendar was closed.
        // Cause of react-hook-form also need ref on input control,
        // we do not have any another way to setup focus instead of querying by dom api
        inputRef.current?.querySelector("input")?.focus();
    };

    const onDateRangeCancel = () => {
        onClose();
        focusInputOnCloseCalendar();
        if (!inputValue) setSelectedDateRange(undefined);
    };

    const onFinishSelectDate = (range?: DateRange, isSame?: boolean) => {
        onClose();
        focusInputOnCloseCalendar();
        setSelectedDateRange(range);
        !isSame && onChange?.(range);
        setInputValue(getFormattedDate(range));
    };

    const onSelectDateRange = () => {
        onFinishSelectDate(selectedDateRange);
    };

    const onCompleteInputDateRange = (range?: DateRange) => {
        onFinishSelectDate(range, isSameDay(range?.from ?? 0, defaultDate?.from ?? 0));
    };

    const onReset = () => {
        onClose();
        focusInputOnCloseCalendar();
        setInputValue("");
        setErrorMessage(undefined);
        onResetDate();
        onChange?.();
    };

    const onBlur = () => {
        isOpen && onClose();
    };

    useEffect(() => {
        setSelectedDateRange(defaultDate);
    }, [defaultDate]);

    useEffect(() => {
        setInputValue(defaultValue || "");
    }, [defaultValue]);

    useClickAway(ref, onDateRangeCancel, inputRef);

    return {
        isOpen,
        toggle,
        onClose,
        inputRef,
        inputValue,
        popoverRef: ref,
        setInputValue,
        setSelectedDateRange,
        selectedDateRange,
        onCompleteInputDateRange,
        onDateRangeCancel,
        onSelectDateRange,
        onReset,
        onBlur,
        errorMessage,
        setErrorMessage,
    };
};
