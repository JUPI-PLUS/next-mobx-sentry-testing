// libs
import { SubmitHandler } from "react-hook-form";
import { AxiosError } from "axios";

// models
import { BaseFormServerValidation } from "../../../shared/models/axios";

export interface VerificationField {
    uuid: string;
    value: string;
    targetTime: number;
}

export interface CodeVerificationFormFields {
    code: string;
}

export interface VerificationDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: SubmitHandler<CodeVerificationFormFields>;
    onResend: () => void;
    codeLength: number;
    verificationField: VerificationField;
    isResendDisabled: boolean;
    error: AxiosError<BaseFormServerValidation> | null;
    type: string;
}

export type CodeVerificationFormProps = Pick<
    VerificationDrawerProps,
    "codeLength" | "verificationField" | "error" | "type"
>;

export interface TimeCounterProps {
    onResend: () => void;
    isResendDisabled: boolean;
    targetTime: number;
}
