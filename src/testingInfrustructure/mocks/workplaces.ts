// libs
import { faker } from "@faker-js/faker";

export const MOCKED_WORKPLACES = new Array(5).fill(null).map(() => ({
    id: faker.random.numeric(3),
    name: faker.random.alpha(10),
    code: faker.random.alpha(6),
    uuid: faker.datatype.uuid(),
    notes: faker.random.alpha(20),
    status_id: 1,
}));

export const MOCKED_WORKPLACE_FIELDS = {
    name: faker.random.alpha(10),
    code: faker.random.alpha(6),
    notes: faker.random.alpha(20),
    status_id: 2,
};

export const MOCKED_WORKPLACE = {
    ...MOCKED_WORKPLACE_FIELDS,
    id: faker.random.numeric(3),
    uuid: faker.datatype.uuid(),
};
