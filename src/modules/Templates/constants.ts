// models
import { TemplateTypeEnum } from "../../shared/models/business/template";

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
    item_type: TemplateTypeEnum.GROUP,
};
