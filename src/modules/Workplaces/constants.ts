export const DEFAULT_WORKPLACES_FILTER_VALUES = {
    search_string: "",
    exam_template_id: [],
};

export const MIN_FILTER_SEARCH_INPUT_LENGTH = 2;

export const DEFAULT_WORKPLACES_FILTER_FIELDS_TYPES = {
    search_string: {
        isString: true,
    },
    exam_template_id: {
        isNumber: true,
        isArray: true,
    },
};
