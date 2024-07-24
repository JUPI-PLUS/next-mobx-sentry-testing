export enum ExamStatusesEnum {
    NEW = 1,
    BIOMATERIALS_RECEIVED,
    IN_PROGRESS,
    VALIDATION,
    TECHNICAL_VALIDATION,
    DONE,
    FAILED,
}

export enum SampleStatuses {
    NEW = 1,
    DAMAGED,
    EXPIRED,
    IN_PROGRESS,
    ARCHIVED,
    DONE,
    FAILED_ON_VALIDATION,
}
export enum ParameterViewTypeEnum {
    STRING = 1,
    NUMBER,
    DROPDOWN_STRICT,
    DROPDOWN_UNSTRICT,
    DROPDOWN_MULTISELECT,
}

export enum UrgencyStatus {
    NORMAL = 1,
    URGENT,
    EMERGENCY,
}
