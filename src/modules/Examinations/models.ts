// models
import { ID } from "../../shared/models/common";
import { CommonDictionaryItem } from "../../shared/models/dictionaries";
import { ParameterViewTypeEnum } from "../../shared/models/business/enums";

export enum SortingByValues {
    EXPIRE_DATE = "expire_date_timestamp",
    CREATION_DATE = "sampling_datetime_timestamp",
    URGENCY = "urgency",
}

export interface ReferenceValue {
    from: number;
    to: number;
    color: string;
    title: string;
    note: string;
    is_normal: boolean;
}

export interface ReferenceValueMaybeHasMarker extends ReferenceValue {
    keyId: string;
    hasMarker: boolean;
}

export interface SampleItemProps {
    isSelected: boolean;
    sampleNumber: string;
    sampleType: string;
    expiredTime: number | null; //TODO: MAYBE ONLY "number" IN FUTURE
    onClickHandler: () => void;
}

export interface SampleFilters {
    expire_date_from: number | null;
    expire_date_to: number | null;
    barcode: string;
    exam_order_number: string;
    type_id: Array<ID>;
    exam_template_id: Array<ID>;
}

export interface ParamFullDetail {
    biological_reference_intervals: string;
    name: string;
    si_measurement_units_id: ID;
    type: string;
    uuid: string;
    value: string;
    type_view_id: ParameterViewTypeEnum;
    reference_values: ReferenceValue[] | null;
    options: CommonDictionaryItem[] | null;
    notes: string | null;
    result_notes: string | null;
}

export interface ExamFullDetail {
    name: string;
    params: Array<ParamFullDetail>;
    exam_template_id: number;
    exam_description: string | null;
    notes: string;
    status_id: number;
    uuid: string;
}

export interface ExaminationBySample {
    exams: Array<ExamFullDetail>;
    order_notes: string;
    order_number: string;
    order_uuid: string;
}

export interface FilteredExams {
    sample_uuid: string;
    orders: Array<{
        uuid: string;
        exams: Array<{ uuid: string }>;
    }>;
}

export interface ExamParam {
    uuid: string;
    name: string;
    si_measurement_units_id: number;
    path: string;
    value: string | null;
    biological_reference_intervals: string;
    options: CommonDictionaryItem[] | null;
    reference_values: ReferenceValue[] | null;
    type_view_id: ParameterViewTypeEnum;
}

export type OrdersConditionBySample = {
    id: ID;
    name: string;
    value: ID;
};

export interface PickedWorkplace {
    uuid: string;
    name: string;
}
