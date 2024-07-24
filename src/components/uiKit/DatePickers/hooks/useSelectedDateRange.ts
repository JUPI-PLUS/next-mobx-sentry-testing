import { useState } from "react";
import { DateRange } from "react-day-picker";

const useSelectedDateRange = (date: DateRange | undefined) => {
    const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(date);

    const onReset = () => {
        setSelectedDateRange({ from: undefined, to: undefined });
    };

    return { selectedDateRange, setSelectedDateRange, onReset };
};

export default useSelectedDateRange;
