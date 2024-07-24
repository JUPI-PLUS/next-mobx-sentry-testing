// models
import { ExamFullDetail, ParamFullDetail, ReferenceValue } from "../../../Examinations/models";
import { Lookup } from "../../../../shared/models/form";
import { ID } from "../../../../shared/models/common";
import { SampleDetails } from "../../../../shared/models/business/sample";

export interface DoneExaminationsProps {
    exams: ExamFullDetail[];
    sampleDetails: SampleDetails;
}

export interface ParameterProps {
    param: ParamFullDetail;
    measureUnitLookup: Lookup<ID>[];
    referenceColorsLookup: Lookup<ID>[];
}

export interface IntervalsProps {
    value: number;
    referenceColorsLookup: Lookup<ID>[];
    biologicalReferenceIntervals: string;
    referenceValues: ReferenceValue[] | null;
}
