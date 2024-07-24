import { faker } from "@faker-js/faker";
import { KitTemplate } from "../../modules/KitTemplate/components/KitForm/models";
import { KitTemplateStatusDictionaryItem } from "../../shared/models/dictionaries";

export const MOCKED_LIST_OF_KITS = [
    {
        code: faker.random.alpha(4),
        id: faker.random.numeric(),
        name: faker.random.alpha(10),
        uuid: faker.datatype.uuid(),
    },
    {
        code: faker.random.alpha(4),
        id: faker.random.numeric(),
        name: faker.random.alpha(10),
        uuid: faker.datatype.uuid(),
    },
];

export const MOCKED_FIRST_KITS_ITEM = MOCKED_LIST_OF_KITS[0];

export const MOCKED_KIT_TEMPLATE: KitTemplate = {
    name: faker.random.alpha(10),
    code: faker.random.alphaNumeric(5),
    status_id: 1,
    uuid: faker.random.alpha(20),
    id: 1,
    parent_group_uuid: null,
};

export const MOCKED_KIT_TEMPLATE_STATUSES: Array<KitTemplateStatusDictionaryItem> = new Array(2)
    .fill(0)
    .map((_, index: number) => ({ id: index + 1, name: `Active kit template status ${index + 1}` }));
