// libs
import { RefCallBack } from "react-hook-form";

// models
import { VerificationInputTypes } from "../BaseVerificationInput/models";

export interface VerificationInputProps {
    name?: string;
    value?: string;
    length?: number;
    type?: VerificationInputTypes;
    placeholder?: string;
    autoFocus?: boolean;
    disabled?: boolean;
    errorMessage?: string;
    containerClassName?: string;
    inputClassName?: string;
    onChange?: (value: string) => void;
    onCompleted?: (value: string) => void;
    formRef?: RefCallBack;
}

export interface FormVerificationInputProps extends Omit<VerificationInputProps, "name" | "errorMessage"> {
    defaultValue?: string;
    name: string;
}
