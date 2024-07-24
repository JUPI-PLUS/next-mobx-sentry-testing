// models
import { Lookup } from "../../../../shared/models/form";
import { ID } from "../../../../shared/models/common";

export type TemplatesUUIDsLookup = Array<{ exam_template_uuid: string }>;

export type KitTemplate = {
    name: string;
    code: string;
    status_id: number | null;
    uuid: string;
    parent_group_uuid: string | null;
    id: number;
};

export type KitTemplateBody = {
    name: string;
    code: string;
    status_id: ID;
    exam_templates: TemplatesUUIDsLookup;
};

export type KitTemplateFormFields = {
    name: string;
    code: string;
    status_id: Lookup<ID> | null;
    exam_templates: string[];
};
