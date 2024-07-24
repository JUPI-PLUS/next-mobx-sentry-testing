export type ExamStatusVariant = "error" | "success" | "warning";

export interface ExamStatusProps {
    text: string;
    variant: ExamStatusVariant;
}
