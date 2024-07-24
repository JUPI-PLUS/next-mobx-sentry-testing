// models
import { ExaminationBySample } from "../../../../models";

export interface OrderListProps {
    orders: ExaminationBySample[];
}

export interface OrderItemProps {
    order: ExaminationBySample;
    orderIndex: number;
}
