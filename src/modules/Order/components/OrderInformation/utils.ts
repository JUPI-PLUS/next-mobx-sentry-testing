import { OrderStatus } from "../../../../shared/models/business/order";

export const getOrderStatus = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.IN_PROGRESS:
            return "In progress";
        case OrderStatus.BIOMATERIALS_RECEIVED:
            return "BiomaterialTypeCell received";
        case OrderStatus.FAILED:
            return "Failed";
        case OrderStatus.DONE:
            return "Done";
        case OrderStatus.PRE_ORDER:
            return "Preorder";
        case OrderStatus.NEW:
        default:
            return "";
    }
};
