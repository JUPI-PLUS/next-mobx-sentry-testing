export const EXAM_TEMPLATE_DEFAULT_VALUES = {
    name: "",
    code: "",
    term: "",
    sample_types_id: null,
    si_measurement_units_id: null,
    volume: "",
    preparation: "",
    description: "",
    status_id: null,
    sample_prefix: "",
    parent_group_uuid: "",
};

export const DEFAULT_EXAM_TEMPLATE_STATUS_ID = 1;

export const EXAM_TEMPLATE_TITLES = {
    GENERAL_INFO: "General info",
    PARAMETERS: "Parameters",
} as const;

export const DEFAULT_EXAM_TEMPLATE_GROUP = {
    group_name: "",
    group_uuid: "",
    params: null,
};

export const DEFAULT_EXAM_TEMPLATE_SOURCE_PARAMS_GROUP = {
    group_name: null,
    group_uuid: null,
    params: [],
};
