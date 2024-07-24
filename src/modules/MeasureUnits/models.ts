import { Row } from "@tanstack/react-table";
import { ExamTemplate } from "../../shared/models/business/exam";
import { MeasureUnit } from "../../shared/models/business/measureUnits";
import { ShortParameter } from "../../shared/models/business/parameter";

export enum MeasureUnitAction {
    CREATE,
    EDIT,
    DELETE,
}

export interface MeasureUnitsFilters {
    search_string: string;
}

export interface MeasureUnitsFilterSearchInputProps {
    name: keyof MeasureUnitsFilters;
    placeholder: string;
    onChange: (value: string) => void;
    onReset: () => void;
    min?: number;
    max?: number;
}

export interface ActionCellProps {
    row: Row<MeasureUnit>;
}

export interface RelationsListProps {
    examTemplatesList: Array<ExamTemplate>;
    paramsList: Array<ShortParameter>;
    measureUnitName: string;
}
