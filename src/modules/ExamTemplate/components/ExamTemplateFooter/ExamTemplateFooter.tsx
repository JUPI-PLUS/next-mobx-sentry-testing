// libs
import React, { FC } from "react";

// models
import { ExamTemplateFooterProps } from "./models";

// components
import { SolidButton, TextButton } from "../../../../components/uiKit/Button/Button";

const ExamTemplateFooter: FC<ExamTemplateFooterProps> = ({
    cancelButtonVariant,
    submitButtonVariant,
    cancelText,
    submitText,
    onCancel,
    onSubmit = () => {},
    submitButtonClassName,
    cancelButtonClassName,
    isCancelButtonDisabled,
    isSubmitButtonDisabled,
    containerClass = "",
}) => {
    return (
        <div className={`flex items-center ${cancelText ? "justify-between" : "justify-end"} ${containerClass}`}>
            {cancelText && (
                <TextButton
                    type="button"
                    size="sm"
                    data-testid="cancel-stepper-button"
                    variant={cancelButtonVariant}
                    text={cancelText}
                    onClick={onCancel}
                    className={cancelButtonClassName}
                    disabled={isCancelButtonDisabled}
                />
            )}
            <SolidButton
                type="submit"
                size="sm"
                data-testid="submit-stepper-button"
                variant={submitButtonVariant}
                text={submitText}
                onClick={onSubmit}
                className={submitButtonClassName}
                disabled={isSubmitButtonDisabled}
            />
        </div>
    );
};

export default ExamTemplateFooter;
