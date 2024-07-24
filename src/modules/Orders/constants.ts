export const DEFAULT_USER_FILTER_VALUES = {
    birth_date_to: null,
    birth_date_from: null,
    email: "",
    first_name: "",
    last_name: "",
    barcode: "",
};

export const DEFAULT_ORDERS_FILTER_VALUES = {
    created_at_from: null,
    created_at_to: null,
    status: null,
    user_uuid: "",
    order_number: "",
};

export const DEFAULT_ORDERS_FILTER_FIELDS_TYPES = {
    order_number: {
        isString: true,
    },
    created_at_from: {
        isNumber: true,
    },
    created_at_to: {
        isNumber: true,
    },
    status: {
        isNumber: true,
    },
    user_uuid: {
        isString: true,
    },
};
