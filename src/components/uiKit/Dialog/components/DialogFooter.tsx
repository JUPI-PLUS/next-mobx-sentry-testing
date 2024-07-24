import React, { FC } from "react";
import { DialogFooterProps } from "../models";
import { OutlineButton, SolidButton } from "../../Button/Button";

const DialogFooter: FC<DialogFooterProps> = ({
    cancelButtonVariant,
    submitButtonVariant,
    isSubmitButtonDisabled,
    cancelText,
    submitText,
    onCancel,
    onSubmit,
    submitButtonClassName,
    cancelButtonClassName,
    isCancelButtonDisabled,
}) => {
    return (
        <div className="flex items-center justify-end">
            {cancelText && (
                <OutlineButton
                    type="button"
                    data-testid="cancel-dialog-button"
                    variant={cancelButtonVariant}
                    text={cancelText}
                    onClick={onCancel}
                    className={`mr-3 ${cancelButtonClassName}`}
                    disabled={isCancelButtonDisabled}
                />
            )}
            <SolidButton
                type="button"
                data-testid="submit-dialog-button"
                variant={submitButtonVariant}
                text={submitText}
                onClick={onSubmit}
                className={submitButtonClassName}
                disabled={isSubmitButtonDisabled}
            />
        </div>
    );
};

export default DialogFooter;
