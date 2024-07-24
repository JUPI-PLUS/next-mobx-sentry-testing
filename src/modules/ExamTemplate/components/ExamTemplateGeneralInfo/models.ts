// models
import { Lookup } from "../../../../shared/models/form";
import { ID } from "../../../../shared/models/common";
import { ExaminationTemplate } from "../../../../shared/models/business/examTemplate";

export interface ExamInfoFormFields {
    name: string;
    code: string;
    term: string;
    sample_types_id: Lookup<ID> | null;
    si_measurement_units_id: Lookup<ID> | null;
    volume: string;
    preparation: string;
    description: string;
    parent_group_uuid: string | null;
    status_id: Lookup<ID>;
    sample_prefix: string;
}

export type ExamInfoFormMutation = Omit<ExaminationTemplate, "uuid" | "id">;
