import React, { FC } from "react";
import { FormDialogFooterProps } from "../models";
import { OutlineButton, SolidButton } from "../../Button/Button";
import { useFormContext } from "react-hook-form";

const DialogFooter: FC<FormDialogFooterProps> = ({
    cancelButtonVariant,
    submitButtonVariant,
    cancelText,
    submitText,
    onCancel,
    submitButtonClassName,
    cancelButtonClassName,
}) => {
    const {
        formState: { isSubmitting, isDirty },
    } = useFormContext();
    return (
        <div className="flex items-center justify-end">
            {cancelText && (
                <OutlineButton
                    variant={cancelButtonVariant}
                    text={cancelText}
                    onClick={onCancel}
                    className={`mr-2 ${cancelButtonClassName}`}
                    disabled={isSubmitting}
                    type="button"
                    data-testid="cancel-dialog-button"
                />
            )}
            <SolidButton
                variant={submitButtonVariant}
                text={submitText}
                type="submit"
                className={submitButtonClassName}
                disabled={isSubmitting || !isDirty}
                data-testid="submit-dialog-button"
            />
        </div>
    );
};

export default DialogFooter;
