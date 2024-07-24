// models
import { SampleFilters } from "../../../models";

export interface ExaminationSearchInputProps {
    fieldName: keyof SampleFilters;
    placeholder: string;
    className?: string;
    onFieldChange: (name: keyof SampleFilters, value: string) => void;
}
