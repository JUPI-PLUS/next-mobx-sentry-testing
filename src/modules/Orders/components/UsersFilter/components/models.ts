export interface UserNameFilterInputProps<T extends Record<string, unknown>> {
    fieldName: keyof T;
    placeholder: string;
    className?: string;
    disabled?: boolean;
    onFieldChange: (name: keyof T, value: string) => void;
}
