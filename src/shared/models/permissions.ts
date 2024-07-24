export type CurrentAccess = number[];
export type RequiredAccess = number | number[];

export enum OrdersPermission {
    VIEW_LIST = 1000,
    CREATE = 1001,
    DOWNLOAD = 1002,
    VIEW_ONE = 1003,
    VIEW_LIST_SELF_CREATED = 1004,
    VIEW_ONE_SELF_CREATED = 1006,
    DELETE = 1008,
}

export enum SamplingPermission {
    SAMPLING_ACTIONS = 2000,
}

export enum ProfilePermission {
    VIEW_ONE = 3000,
    EDIT_GENERAL_FIELDS = 3001,
    MAKE_STAFF = 3002,
}

export enum ExaminationResultsPermission {
    VIEW_LIST = 4000,
    SAVE_RESULTS = 4001,
    VALIDATE_RESULTS = 4002,
}

export enum ExaminationsPermission {
    CONSTRUCTOR = 5000,
}

export enum AdministratorPermission {
    ROLE_ACTIONS = 5001,
    WORKPLACES = 5002,
}

export enum UsersPermission {
    ASSIGN_ROLE = 3003,
    VIEW_LIST = 1005,
    USER_AVATAR = 3004,
    USER_CONTACTS = 3006,
}

export type WholePermissionsGroups =
    | OrdersPermission
    | SamplingPermission
    | ProfilePermission
    | ExaminationResultsPermission
    | ExaminationsPermission
    | AdministratorPermission
    | UsersPermission;

export type Permissions =
    | typeof OrdersPermission
    | typeof SamplingPermission
    | typeof ProfilePermission
    | typeof ExaminationResultsPermission
    | typeof ExaminationsPermission
    | typeof AdministratorPermission
    | typeof UsersPermission;

export type Permission = {
    id: number;
    name: string;
    group: string;
    description: string;
};
