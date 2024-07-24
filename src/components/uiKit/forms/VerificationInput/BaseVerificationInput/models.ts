export type VerificationInputTypes = "alphanumeric" | "number";

export interface BaseVerificationInputProps {
    autoFocus?: boolean;
    isError?: boolean;
    length?: number;
    onChange?: (data: string) => void;
    onCompleted?: (data: string) => void;
    placeholder?: string;
    type?: VerificationInputTypes;
    value?: string;
}
