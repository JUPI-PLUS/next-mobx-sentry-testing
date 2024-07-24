import React, { FC } from "react";
import { OutlineButton, SolidButton } from "../../Button/Button";

interface DatePickerFooterProps {
    onCancel: () => void;
    onSubmit: () => void;
    onReset: () => void;
}

const DatePickerFooter: FC<DatePickerFooterProps> = ({ onCancel, onReset, onSubmit }) => {
    return (
        <div className="flex items-center justify-between mt-4 border-t p-5 pl-10">
            <div>
                <p className="text-sm font-bold cursor-pointer" onClick={onReset} data-testid="reset-datepicker-button">
                    Reset
                </p>
            </div>
            <div className="flex">
                <OutlineButton
                    text="Cancel"
                    onClick={onCancel}
                    data-testid="date-picker-cancel-button"
                    className="mr-3"
                    size="sm"
                />
                <SolidButton text="Submit" onClick={onSubmit} data-testid="date-picker-submit-button" size="sm" />
            </div>
        </div>
    );
};

export default DatePickerFooter;
