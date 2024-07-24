import React, { FC, useMemo } from "react";
import { DatePickerFooterProps } from "../../models";
import { format } from "date-fns";
import { DATE_FORMATS } from "../../../../../shared/constants/formates";
import { OutlineButton, SolidButton } from "../../../Button/Button";

const DatePickerFooter: FC<DatePickerFooterProps> = ({ range, onCancel, onSubmit }) => {
    const footerLabel = useMemo(() => {
        if (!range?.from) return "";
        if (!range.to) return format(range.from, DATE_FORMATS.DATE_ONLY);

        return `${format(range.from, DATE_FORMATS.DATE_ONLY)} – ${format(range.to, DATE_FORMATS.DATE_ONLY)}`;
    }, [range]);

    return (
        <div>
            <div className="mt-2 mb-2 text-base">{footerLabel}</div>
            <div className="flex justify-end">
                <div className="mr-4">
                    <OutlineButton text="Cancel" size="sm" onClick={onCancel} />
                </div>
                <div>
                    <SolidButton text="Apply" size="sm" onClick={() => onSubmit(range!)} />
                </div>
            </div>
        </div>
    );
};

export default DatePickerFooter;
