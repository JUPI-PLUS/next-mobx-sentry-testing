//  models
import { ExamParam } from "../../../modules/Examinations/models";
import { Sample } from "./sample";
import { ID } from "../common";
import { UrgencyStatus } from "./enums";

export interface ExamTemplate {
    id: number;
    name: string;
    code: string;
    sample_types_id: number;
    sample_types_name: string;
    uuid: string;
    status_id: number;
    term: number;
    description?: string;
    preparation?: string;
    si_measurement_units_id?: number;
    volume?: number;
    parent_group_uuid?: string;
}

export enum ExamStatusesEnum {
    NEW = 1,
    BIOMATERIAL_RECEIVED,
    IN_PROGRESS,
    ON_VALIDATION,
    TECHNICAL_VALIDATION,
    DONE,
    FAILED,
}

export interface ExaminationResult {
    uuid: string;
    name: string;
    notes: string | null;
    status_id: number | null;
    params: ExamParam[];
}

export interface ExamOfSample {
    id: ID;
    uuid: string;
    name: string;
    template_id: number;
    status: ExamStatusesEnum;
    referral_doctor: string | null;
    order_uuid: string;
    order_number: string;
    urgency_id: UrgencyStatus;
}

export interface ExaminationSample extends Sample {
    first_name: string | null;
    last_name: string | null;
    birth_date_at_timestamp: number | null;
    exams: ExamOfSample[];
}
