import { ParameterOptionsFilters } from "../../models";

export interface ParameterOptionsSearchInputProps {
    name: keyof ParameterOptionsFilters;
    placeholder: string;
    min?: number;
    max?: number;
    autoFocus?: boolean;
}
