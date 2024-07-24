import React, { FC } from "react";
import { DrawerFooterProps } from "../models";
import { OutlineButton, SolidButton, TextButton } from "../../Button/Button";

const DrawerFooter: FC<DrawerFooterProps> = ({
    cancelButtonVariant,
    submitButtonVariant,
    cancelText,
    submitText,
    optionalText,
    onCancel,
    onSubmit,
    onOptional,
    submitButtonClassName,
    cancelButtonClassName,
}) => {
    return (
        <div className="flex items-center justify-end border-t pt-4 pb-6 px-6">
            {optionalText && (
                <TextButton
                    text={optionalText}
                    onClick={onOptional}
                    className="mr-auto hover:bg-transparent hover:underline"
                    variant="neutral"
                    size="thin"
                    data-testid="optional-drawer-button"
                />
            )}
            {cancelText && (
                <OutlineButton
                    size="sm"
                    data-testid="cancel-drawer-button"
                    variant={cancelButtonVariant}
                    text={cancelText}
                    onClick={onCancel}
                    className={`mr-2 ${cancelButtonClassName}`}
                />
            )}
            <SolidButton
                size="sm"
                data-testid="submit-drawer-button"
                variant={submitButtonVariant}
                text={submitText}
                onClick={onSubmit}
                className={submitButtonClassName}
            />
        </div>
    );
};

export default DrawerFooter;
