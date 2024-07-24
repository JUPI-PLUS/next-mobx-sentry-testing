import { OrderStatus } from "../../../../../../shared/models/business/order";

export interface StatusCellProps {
    status: OrderStatus;
    text: string;
}
