// models
import { ButtonVariant } from "../../../../components/uiKit/Button/models";

export interface ExamTemplateFooterProps {
    cancelText?: string;
    submitText?: string;
    cancelButtonVariant?: ButtonVariant;
    submitButtonVariant?: ButtonVariant;
    submitButtonClassName?: string;
    cancelButtonClassName?: string;
    containerClass?: string;
    isCancelButtonDisabled?: boolean;
    isSubmitButtonDisabled?: boolean;
    onCancel?: () => void;
    onSubmit?: () => void;
}
