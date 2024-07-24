// models
import { Lookup } from "../../shared/models/form";
import { ID } from "../../shared/models/common";
import { CommonServerValidationProps } from "../../shared/models/serverValidation";

export type ExamTemplateError = string | null;

export interface WorkplaceBody {
    name: string;
    code: string;
    notes: string;
    status_id: ID;
    exam_templates_uuids: string[];
}

export type WorkplaceFormFields = {
    name: string;
    code: string;
    notes: string;
    status_id: Lookup<ID> | null;
    exam_templates: string[];
};

export type WorkplaceFormProps = CommonServerValidationProps & {
    generalStatusesLookup: Lookup<ID>[];
};
