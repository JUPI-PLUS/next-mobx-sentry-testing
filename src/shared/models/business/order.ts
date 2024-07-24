export enum OrderStatus {
    PRE_ORDER = 1,
    NEW,
    BIOMATERIALS_RECEIVED,
    IN_PROGRESS,
    DONE,
    FAILED,
}

export interface Order {
    uuid: string;
    user_uuid: string;
    creator_uuid: string;
    user_barcode: string;
    first_name: string;
    last_name: string;
    order_number: string;
    status: OrderStatus;
    referral_doctor: string;
    number_of_exams: number;
    created_at: string;
    created_at_timestamp: number;
    updated_at: string;
    updated_at_timestamp: number;
}
