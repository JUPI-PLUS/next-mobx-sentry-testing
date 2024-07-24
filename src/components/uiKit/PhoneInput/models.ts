import { FocusEventHandler, MouseEventHandler, ReactNode } from "react";
import { RefCallBack } from "react-hook-form";
import { CountryIso2 } from "react-international-phone";

export interface PhoneInputProps {
    initialCountry?: CountryIso2;
    value?: string;
    name?: string;
    label?: string | ReactNode;
    readOnly?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    placeholder?: string;
    inputClassName?: string;
    containerClassName?: string;
    accept?: string;
    autoFocus?: boolean;
    maxLength?: number;
    isFilter?: boolean;
    onClick?: MouseEventHandler<HTMLInputElement>;
    onChange?: (phone: string) => void;
    onBlur?: FocusEventHandler<HTMLInputElement>;
    formRef?: RefCallBack;
}

export interface FormPhoneInputProps extends Omit<PhoneInputProps, "name"> {
    defaultValue?: string;
    name: string;
}
