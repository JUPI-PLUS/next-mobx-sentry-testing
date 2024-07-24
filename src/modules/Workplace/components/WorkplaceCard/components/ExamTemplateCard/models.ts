// models
import { ExamTemplate } from "../../../../../../shared/models/business/exam";
import { ExamTemplateError } from "../../../../models";

export interface ExamTemplateCardProps {
    examTemplate: ExamTemplate;
    onRemoveClick: () => void;
    errorMessage?: ExamTemplateError;
}
