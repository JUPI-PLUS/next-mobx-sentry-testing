// models
import { ExamTemplateItemWithId } from "../../models";
import { Parameter } from "../../../../../../shared/models/business/parameter";

export interface ExamTemplateListProps {
    parameters: ExamTemplateItemWithId[];
}

export interface ExamTemplateParamsListProps {
    params: Parameter[];
}
