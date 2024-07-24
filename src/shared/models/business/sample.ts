import { ID } from "../common";
import { SampleStatuses } from "./enums";
import { ExamOfSample } from "./exam";

export interface Sample {
    id: ID;
    uuid: string;
    type_id: number; // TODO: What is that?
    barcode: string;
    expire_date_timestamp: number;
    sampling_datetime_timestamp: number;
    volume: number;
    si_measurement_units_id: number;
    sample_statuses_id: SampleStatuses;
    user_uuid: string;
    created_at_timestamp: number;
    updated_at_timestamp: number;
    exams?: Array<ExamOfSample>;
}

// TODO! extends from Sample but as for now, by calling different endpoints we receive different responses
export type SampleDetails = {
    uuid: string;
    sample_statuses_id: SampleStatuses;
    sampling_datetime: string;
    sampling_datetime_timestamp: number;
    sample_barcode: string;
    sample_type_id: number;
    si_measurement_units_id: number;
    volume: number;
    user_uuid: string;
};

export enum SampleActionType {
    Details = 1,
    ChangeStatus,
    DetachExams,
    Resample,
    PrintSample,
    EditMarkAsDamagedNote,
}
