export enum Sex {
    MALE = 1,
    FEMALE,
    UNKNOWN,
}

export enum UserStatus {
    NEW = 0,
    ACTIVE = 10,
    BLOCKED = 20,
    // ADMIN = 30,
}

export interface User {
    barcode: string;
    id: number;
    uuid: string;
    sex_id: Sex | null;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    birth_date: number | null;
    profile_photo?: string | null;
    status?: UserStatus;
}

export interface StaffInfo {
    organization_id: number | null;
    position_id: number | null;
}

export type Me = User & StaffInfo;
export type Patient = User & StaffInfo;
// TODO! Move timestamp to User models
export type FilteredUser = User & {
    birth_date_at_timestamp: number | null;
};
