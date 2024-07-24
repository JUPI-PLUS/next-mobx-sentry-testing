import { OrderExamDetails } from "../../models";

export enum OrderExaminationRowTypeEnum {
    GROUP,
    EXAM,
}

export interface ExaminationsTableProps {
    orderUUID: string;
}

export interface OrderExaminationGroupRow {
    type: OrderExaminationRowTypeEnum.GROUP;
    sampleName: string;
    exams: OrderExamDetails[];
}

export interface OrderExaminationRow extends OrderExamDetails {
    type: OrderExaminationRowTypeEnum.EXAM;
    sampleName: string;
    exam_status_text: string;
}

export type OrderExaminationTableRow = OrderExaminationGroupRow | OrderExaminationRow;
