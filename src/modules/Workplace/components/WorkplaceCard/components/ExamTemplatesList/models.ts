// models
import { ExamTemplate } from "../../../../../../shared/models/business/exam";

export type ExamTemplateOption = ExamTemplate & {
    value: string;
    label: string;
    name: string;
};

export interface AddExamButtonProps {
    onClick: () => void;
    shouldScrollToBottom: boolean;
}
