import React, { FC, useMemo } from "react";
import { FormDrawerFooterProps } from "../models";
import { OutlineButton, SolidButton, TextButton } from "../../Button/Button";
import { useFormContext } from "react-hook-form";

const DrawerFooter: FC<FormDrawerFooterProps> = ({
    cancelButtonVariant,
    submitButtonVariant,
    optionalText,
    cancelText,
    submitText,
    submitButtonClassName,
    cancelButtonClassName,
    isSubmitButtonDisabled,
    isOptionalButtonDisabled,
    disableOnCleanFields,
    onCancel,
    onOptional,
}) => {
    const {
        formState: { isSubmitting, isDirty },
    } = useFormContext();

    const isSubmitDisabled = useMemo(() => {
        if (disableOnCleanFields && !isDirty) {
            return true;
        }

        return isSubmitting || isSubmitButtonDisabled;
    }, [disableOnCleanFields, isDirty, isSubmitButtonDisabled, isSubmitting]);

    return (
        <div className="flex items-center justify-end border-t pt-4 pb-6 px-6">
            {optionalText && (
                <TextButton
                    text={optionalText}
                    onClick={onOptional}
                    disabled={isSubmitting || isOptionalButtonDisabled}
                    className="mr-auto hover:bg-transparent hover:underline"
                    variant="neutral"
                    type="button"
                    size="thin"
                    data-testid="drawer-optional-button"
                />
            )}
            {cancelText && (
                <OutlineButton
                    size="sm"
                    variant={cancelButtonVariant}
                    text={cancelText}
                    onClick={onCancel}
                    className={`mr-2 ${cancelButtonClassName}`}
                    disabled={isSubmitting}
                    type="button"
                    data-testid="drawer-cancel-button"
                />
            )}
            <SolidButton
                size="sm"
                variant={submitButtonVariant}
                text={submitText}
                type="submit"
                className={submitButtonClassName}
                disabled={isSubmitDisabled}
                data-testid="submit-drawer-button"
            />
        </div>
    );
};

export default DrawerFooter;
