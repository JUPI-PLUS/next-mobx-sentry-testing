import { Row } from "@tanstack/react-table";
import { ExamTemplate } from "../../shared/models/business/exam";
import { SampleType } from "../../shared/models/business/sampleTypes";

export enum SampleTypeAction {
    CREATE,
    EDIT,
    DELETE,
}

export interface SampleTypesFilters {
    name: string;
}

export interface SampleTypesFilterSearchInputProps {
    name: keyof SampleTypesFilters;
    placeholder: string;
    onChange: (value: string) => void;
    onReset: () => void;
    min?: number;
    max?: number;
    autoFocus?: boolean;
}

export interface ActionCellProps {
    row: Row<SampleType>;
}

export interface ExamTemplatesListProps {
    list: Array<ExamTemplate>;
    sampleTypeName: string;
}

export interface DeleteDialogContentProps {
    isDeleteAvailable: boolean;
    examTemplatesList: Array<ExamTemplate>;
    isLoading: boolean;
    sampleTypeName: string;
}
