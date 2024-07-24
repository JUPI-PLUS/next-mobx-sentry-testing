// models
import { Parameter } from "../../../../shared/models/business/parameter";
import { AddEditParamToExamTemplate } from "../../../../shared/models/business/examTemplate";

export enum ExamTemplateParamTypesEnum {
    GROUP = 1,
    PARAMETER,
}

export type ParamsRelationsData = { param_uuid: string; group_uuid: string }[];

export type ExamTemplateItemWithId = AddEditParamToExamTemplate & { id: string };

export type ExamTemplateItemGroup = Pick<ExamTemplateItemWithId, "id"> & {
    group_name: string;
    group_uuid: string;
    params: Parameter[] | null;
};

export type ExamTemplateItemParameter = Pick<ExamTemplateItemWithId, "id"> & {
    group_name: null;
    group_uuid: null;
    params: Parameter[];
};

export interface ExamTemplateGroupItemProps {
    parameter: ExamTemplateItemGroup;
}

export interface ExamTemplateParamsItemProps {
    parameter: Parameter;
    parentUUID?: string;
}
