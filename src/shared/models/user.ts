import { Sex, UserStatus } from "./business/user";

export interface User {
    id: number;
    uuid: string;
    sex_id?: Sex;
    first_name?: string;
    last_name?: string;
    email: string;
    birth_date: number;
    profile_photo?: string | null;
    status?: UserStatus;
}
