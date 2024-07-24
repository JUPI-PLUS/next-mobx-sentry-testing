// models
import { Parameter } from "./parameter";
import { ID } from "../common";

export enum ExamTemplateStatusesEnum {
    ACTIVE = 1,
    INACTIVE,
}

export interface ExaminationTemplate {
    id: ID;
    uuid: string;
    name: string;
    code: string;
    term: number | null;
    sample_types_id: ID | null;
    si_measurement_units_id: ID | null;
    volume: number | null;
    preparation: string | null;
    description: string | null;
    parent_group_uuid: string | null;
    status_id: ID;
    sample_prefix: number | null;
}

export interface ExamTemplateParam {
    group_name: string | null;
    group_uuid: string | null;
    params?: Parameter[] | null;
    status_id: ExamTemplateStatusesEnum;
}

export type AddEditParamToExamTemplate = Omit<ExamTemplateParam, "status_id">;
