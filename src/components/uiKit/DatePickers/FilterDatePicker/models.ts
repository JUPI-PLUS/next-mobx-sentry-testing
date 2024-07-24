import { DateRange } from "react-day-picker";

export interface DatePickerInputProps {
    value: string;
    name?: string;
    placeholder?: string;
    onReset: (range?: DateRange) => void;
    toggleCalendarVisibility: () => void;
    label?: string;
    disabled?: boolean;
    onComplete?: (range?: DateRange) => void;
    selectedDate?: DateRange;
}
