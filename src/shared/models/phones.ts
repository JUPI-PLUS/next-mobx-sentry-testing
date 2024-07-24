import { ID } from "./common";

export interface PhoneContact {
    uuid: string;
    type_id: ID;
    number: string;
    is_primary: boolean;
    verified_at: string;
}

export interface PhoneContactBody {
    user_uuid: string;
    type_id: ID;
    number: string;
}
