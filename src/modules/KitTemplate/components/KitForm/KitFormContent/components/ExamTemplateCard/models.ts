// models
import { ExamTemplate } from "../../../../../../../shared/models/business/exam";
import { ExamTemplateError } from "../../../../../utils";

export type ExamTemplateCard = Pick<
    ExamTemplate,
    "id" | "uuid" | "name" | "code" | "sample_types_id" | "sample_types_name" | "status_id"
>;
export interface ExamTemplateCardProps {
    index: number;
    examTemplate: ExamTemplateCard;
    onRemoveClick: () => void;
    errorMessage?: ExamTemplateError;
    onMoveCard: (dragIndex: number, hoverIndex: number) => void;
}
