import { ID } from "../models/common";

export const USERS_QUERY_KEYS = {
    ME: "me",
    ROLES: (uuid: string) => ["users", "roles", uuid],
    ORDERS_FILTER_USERS_LIST: (filters: string) => ["users-list", filters],
    AVATAR: (uuid: string, imageName: string) => ["user", "avatar", uuid, imageName],
};

export const PATIENTS_QUERY_KEYS = {
    PATIENT: (id: string) => ["patient", id],
};

export const PHONES_QUERY_KEYS = {
    LIST: (uuid: string) => ["phones", "list", uuid],
};

export const EMAILS_QUERY_KEYS = {
    LIST: (uuid: string) => ["emails", "list", uuid],
};

export const PROJECTS_QUERY_KEYS = {
    LIST: "projects-list",
    DETAILS: (id: string) => ["project", id],
    PROJECT_USERS: (id: string) => ["project", id, "users"],
};

export const KITS_QUERY_KEYS = {
    LIST: ["kits", "list"],
    DETAILS: (uuid: string) => ["kits", "kit-template", uuid],
    KIT_EXAM_TEMPLATES: (kitUUID: string) => ["kits", "examTemplates", kitUUID],
    KIT_EXAMS_TEMPLATES_BY_KIT_CODE: (kitCode: string) => ["kits", "examsTemplates", kitCode],
    KIT_ORDER_CONDITIONS_BY_KIT_CODE: (kitCode: string) => ["kits", "orderConditions", kitCode],
};

export const DICTIONARIES_QUERY_KEYS = {
    MEASUREMENT_UNITS: ["sample", "measurement-units"],
    ORDER_STATUSES: ["order", "statuses"],
    SAMPLE_TYPES: ["order", "exams", "sample-types"],
    EXAM_STATUSES: ["order", "exams", "statuses"],
    EXAM_TEMPLATE_STATUSES: ["exams", "template", "statuses"],
    KIT_TEMPLATE_STATUSES: ["kit", "template", "statuses"],
    GENERAL_STATUSES: ["general", "statuses"],
    EXAM_TEMPLATES: ["exams", "templates"],
    SEX_TYPES: ["profile", "sex-types"],
    ORGANIZATIONS: ["profile", "organizations"],
    USER_ROLES: ["profile", "roles"],
    POSITIONS: ["profile", "positions"],
    PARAMETER_TYPES: ["parameter", "types"],
    CONDITION_TYPES: ["condition", "types"],
    REFERENCE_COLORS: ["reference", "colors"],
    WORKPLACES: ["dictionary", "workplaces"],
    URGENCY_TYPES: ["dictionary", "urgency-types"],
    DAMAGE_TYPES: ["dictionary", "damage-types"],
    PHONE_TYPES: ["phone", "types"],
    EMAIL_TYPES: ["email", "types"],
};

export const ORDERS_QUERY_KEYS = {
    LIST: ["orders"],
    ONE: (id: string) => ["orders", id],
    ORDER_EXAMS_DETAILS: (id: string) => ["order", id, "exams"],
    CONDITIONS: (examUUIDs: Array<string>) => ["parameter", "conditions", examUUIDs],
};

export const SAMPLES_QUERY_KEYS = {
    DETAILS: (id: string) => ["sample", id],
    GENERATE_SAMPLE_NUMBER: ["sample", "generate"],
    DETAILS_BY_BARCODE: (barcode: string) => ["sample", "details", barcode],
    ORDERS_CONDITIONS: (id: string) => ["sample", "orders", "conditions", id],
    CHANGE_STATUS: (id: string) => ["sample", id, "change-status"],
    FILTER_SAMPLES_LIST: (filters: string) => ["samples-list", filters],
    EXAMINATIONS_BY_SAMPLE: (uuid: string) => ["sample", "examinations", uuid],
    FILTER_SAMPLES_LOOKUPS: [
        "sample",
        ...DICTIONARIES_QUERY_KEYS.SAMPLE_TYPES,
        ...DICTIONARIES_QUERY_KEYS.EXAM_TEMPLATES,
    ],
};

export const TEMPLATES_QUERY_KEYS = {
    LIST: (filters?: string) => ["templates", "list", filters],
    PARENTS: (uuid: string) => ["templates", "parents", uuid],
};

export const EXAM_TEMPLATE_QUERY_KEYS = {
    INFO: (uuid: string) => ["exam-template", uuid, "info"],
    PARAMS: (uuid: string) => ["exam-template", uuid, "params"],
    LIST: ["exam-template", "list"],
};

export const ORDER_RESULTS_QUERY_KEYS = {
    DOWNLOAD_ORDER_PDF: (uuid: string) => ["order", uuid, "pdf"],
};

export const PERMISSIONS_QUERY_KEYS = {
    LIST: ["permissions"],
    BY_ROLE: (id: ID) => ["permissions", id],
};

export const ROLES_QUERY_KEYS = {
    LIST: (rolesFilters?: string) => ["roles", rolesFilters],
    BY_PERMISSION: (id: ID) => ["roles", id],
};

export const PARAMETER_OPTIONS_QUERY_KEYS = {
    ASSIGNED_PARAMETERS_TO_OPTION: (id: number) => ["assigned", "parameters", id],
};

export const PARAMETER_QUERY_KEYS = {
    DETAILS: (uuid: string) => ["parameter", "details", uuid],
    CONDITIONS: (uuid: string) => ["parameter", "conditions", uuid],
    EXAM_TEMPLATES_BY_UUID: (uuid: string) => ["exam", "templates", "by", uuid],
};

export const WORKPLACE_QUERY_KEYS = {
    DETAILS: (uuid: string) => ["workplace", "details", uuid],
    EXAM_TEMPLATES_BY_UUID: (uuid: string) => ["workplace", "exam", "templates", "by", uuid],
};

export const SAMPLE_TYPES_QUERY_KEYS = {
    DETAILS: (id: number) => ["sample-types", "details", id],
    EXAM_TEMPLATES_BY_ID: (id: number) => ["sample-types", "exam-template", id],
};

export const MEASURE_UNITS_QUERY_KEYS = {
    DETAILS: (id: number) => ["measure-units", "details", id],
    EXAM_TEMPLATES_BY_ID: (id: number) => ["measure-units", "exam-template", id],
    PARAMS_BY_ID: (id: number) => ["measure-units", "params", id],
};
