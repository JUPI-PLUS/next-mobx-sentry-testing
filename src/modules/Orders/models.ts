import { Order } from "../../shared/models/business/order";

export interface OrderModuleItem extends Order {
    type: "MASTER";
    expanded: boolean;
}

export interface OrderModuleItemDetails extends Order {
    expanded: boolean;
    type: "DETAIL";
    uuid: string;
    parentUUID: string;
}

// TODO: recheck

export interface UserFilters {
    birth_date_from: number | null;
    birth_date_to: number | null;
    email: string;
    barcode: string;
    first_name: string;
    last_name: string;
}

export interface OrdersFilters {
    created_at_from: number | null;
    created_at_to: number | null;
    status: number | null;
    user_uuid: string;
    order_number: string;
}

export type ExpandableOrderRow = OrderModuleItem | OrderModuleItemDetails;
