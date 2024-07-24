export interface FiltersSearchInputProps {
    name: string;
    placeholder: string;
    className?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    onChange: (value: string) => void;
    onReset: () => void;
}
