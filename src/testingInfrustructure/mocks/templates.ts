import { faker } from "@faker-js/faker";
import { Template, TemplateStatusEnum, TemplateTypeEnum } from "../../shared/models/business/template";

export const MOCKED_TEMPLATE = (templateProps?: Partial<Template>): Template => ({
    item_type: faker.datatype.number({ min: 1, max: 3 }),
    uuid: faker.datatype.uuid(),
    name: faker.random.alpha(10),
    code: faker.random.alpha(10),
    status: TemplateStatusEnum.ACTIVE,
    has_child: faker.datatype.boolean(),
    parent_uuid: null,
    sample_type_id: null,
    ...templateProps,
});

export const MOCKED_LIST_OF_TEMPLATES_IN_FOLDER = [
    MOCKED_TEMPLATE({
        item_type: TemplateTypeEnum.KIT,
        has_child: false,
    }),
    MOCKED_TEMPLATE({
        item_type: TemplateTypeEnum.EXAM,
        has_child: false,
    }),
];

export const MOCKED_LIST_OF_TEMPLATES = [
    ...[
        MOCKED_TEMPLATE({
            item_type: TemplateTypeEnum.GROUP,
            has_child: true,
        }),
        MOCKED_TEMPLATE({
            item_type: TemplateTypeEnum.KIT,
            has_child: false,
        }),
        MOCKED_TEMPLATE({
            item_type: TemplateTypeEnum.EXAM,
            has_child: false,
        }),
    ],
    ...new Array(10).fill(0).map(() => MOCKED_TEMPLATE()),
];

export const FIRST_MOCKED_TEMPLATE = MOCKED_LIST_OF_TEMPLATES[0];
