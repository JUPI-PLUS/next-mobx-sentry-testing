import { PropsWithChildren } from "react";
import { SampleStatuses } from "../../../../../../../../../shared/models/business/enums";
import { OrderExamDetails } from "../../../../../../../models";
import { SampleActionType } from "../../../../../../../../../shared/models/business/sample";
import { ID } from "../../../../../../../../../shared/models/common";
import { Lookup } from "../../../../../../../../../shared/models/form";

export type SampleChangeStatusFormFields = {
    updated_at: { from: Date };
    damage_reason: null | Lookup<number>;
};

export type SampleChangeMarkAsDamagedNoteFormFields = {
    notes: string;
};

export type SampleChangeStatusPatchFields = {
    sample_statuses_id: SampleStatuses;
    updated_at: number;
    damage_reason: number;
};

export type SampleMarkAsDamagedPatch = {
    sampleChangeStatusPatchFields: SampleChangeStatusPatchFields;
    uuid: string;
};

type ExamUUIDSamplingData = { exam_uuid: string };

// TODO: Rename type
// TODO: NO-USE
export type DetachExamsFromSampleData = {
    exams: { exams: Array<ExamUUIDSamplingData> };
    uuid: string;
};

// TODO: NO-USE
export type AttachSampleToExamsData = {
    exams: { exams: Array<ExamUUIDSamplingData> };
    uuid: string;
};

// TODO: NO-USE
export type CreateSampleData = {
    uuid: string; // Order uuid
    sampling_datetime: number;
    sample_barcode: string;
    sample_type_id: number;
    volume: number;
    si_measurement_units_id: number;
    exams: {
        exam_id: ID;
    }[];
};

export type SampleDropdownProps = PropsWithChildren & {
    userUUID: string;
    exam: OrderExamDetails;
    isSampleDamaged: boolean;
};

export type SampleDropdownContentProps = SampleDropdownProps & {
    onItemClick: (type: SampleActionType) => void;
    isSomeExamOnValidation: boolean;
    onClose: () => void;
};
