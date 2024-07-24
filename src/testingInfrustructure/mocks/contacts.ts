// libs
import { faker } from "@faker-js/faker";

// mocks
import { MOCKED_EMAIL_TYPES, MOCKED_PHONE_TYPES } from "./dictionaries";

export const MOCKED_USER_EMAIL = (props = {}) => ({
    uuid: faker.datatype.uuid(),
    type_id: MOCKED_EMAIL_TYPES[0].id,
    email: faker.random.alpha(10),
    is_primary: true,
    verified_at: faker.date.past().toISOString(),
    ...props,
});

export const MOCKED_USER_PHONE = (props = {}) => ({
    uuid: faker.datatype.uuid(),
    type_id: MOCKED_PHONE_TYPES[0].id,
    number: faker.phone.number("+380 (##) ### ## ##"),
    is_primary: true,
    verified_at: faker.date.past().toISOString(),
    ...props,
});

export const MOCKED_USER_EMAILS_LIST = (length = 4, props = {}) =>
    new Array(length).fill(null).map((_, index) => MOCKED_USER_EMAIL({ is_primary: !Boolean(index), ...props }));

export const MOCKED_USER_PHONES_LIST = (length = 4, props = {}) =>
    new Array(length).fill(null).map((_, index) => MOCKED_USER_PHONE({ is_primary: !Boolean(index), ...props }));
