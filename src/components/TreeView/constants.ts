// models
import { TemplatesTypesEnum } from "./models";

export const DEFAULT_TEMPLATES_FILTER_VALUES = {
    status: null,
    name: "",
};

export const DEFAULT_TEMPLATES_GROUP = {
    name: "",
    uuid: "",
    status: null,
    code: null,
    has_child: false,
    item_type: TemplatesTypesEnum.GROUP,
};
