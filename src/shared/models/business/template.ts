export enum TemplateStatusEnum {
    ACTIVE = 1,
    INACTIVE,
    DELETE,
}

export enum TemplateTypeEnum {
    GROUP = 1,
    KIT,
    EXAM,
}

export interface Template {
    item_type: TemplateTypeEnum;
    uuid: string;
    parent_uuid: null | string; // can be null if it's root
    code: null | string; // can be null if it's folder
    status: null | TemplateStatusEnum; // can be null if it's folder
    name: string;
    has_child: boolean;
    sample_type_id: null | number; // will be null if it's not exam
}
