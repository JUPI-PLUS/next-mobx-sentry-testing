// models
import { SortingWay } from "../../shared/models/common";
import { SortingByValues } from "./models";

export const PROPERTY_PATH_SEPARATOR = ".";
export const FORM_PROPERTY_PATH_SEPARATOR = "-";

export const DEFAULT_DEBOUNCE_TIME = 300;

export const DEFAULT_SAMPLES_FILTER_VALUES = {
    expire_date_from: null,
    expire_date_to: null,
    barcode: "",
    exam_order_number: "",
    type_id: [],
    exam_template_id: [],
};

export const DEFAULT_SAMPLES_SORTING_VALUES = {
    order_by: "",
    order_way: SortingWay.NONE,
};

export const SORTING_BY_TITLES = {
    [SortingByValues.EXPIRE_DATE]: "Expire date",
    [SortingByValues.CREATION_DATE]: "Creation date",
    [SortingByValues.URGENCY]: "Urgency",
} as const;
