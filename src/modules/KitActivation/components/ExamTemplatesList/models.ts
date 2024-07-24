import { ExamTemplate } from "../../../../shared/models/business/exam";

export interface ExamTemplatesListProps {
    examsTemplates: Array<ExamTemplate>;
    isExamsTemplatesFetching: boolean;
}
