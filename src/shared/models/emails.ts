import { ID } from "./common";

export interface EmailContact {
    uuid: string;
    type_id: ID;
    email: string;
    is_primary: boolean;
    verified_at: string;
}

export interface EmailContactBody {
    user_uuid: string;
    type_id: ID;
    email: string;
}
