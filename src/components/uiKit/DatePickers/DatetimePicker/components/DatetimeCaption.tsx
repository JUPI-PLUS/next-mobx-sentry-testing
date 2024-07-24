import React from "react";
import { CaptionProps, useNavigation } from "react-day-picker";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";
import { DATE_FORMATS } from "../../../../../shared/constants/formates";

const DatetimeCaption = ({ displayMonth }: CaptionProps) => {
    const { goToMonth, nextMonth, previousMonth } = useNavigation();

    return (
        <div className="flex justify-between items-center mt-4 mb-4">
            <button
                className="hover:bg-brand-100-1 rounded-full"
                disabled={!previousMonth}
                onClick={() => previousMonth && goToMonth(previousMonth)}
            >
                <ChevronLeftIcon className="w-6 h-6" />
            </button>
            <h2 className="text-sm font-bold">{format(displayMonth, DATE_FORMATS.DATETIME_CAPTION)}</h2>
            <button
                className="hover:bg-brand-100-1 rounded-full"
                disabled={!nextMonth}
                onClick={() => nextMonth && goToMonth(nextMonth)}
            >
                <ChevronRightIcon className="w-6 h-6" />
            </button>
        </div>
    );
};

export default DatetimeCaption;
