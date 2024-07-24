// libs
import { faker } from "@faker-js/faker";

export const MOCKED_PARAMETERS = (props = {}) =>
    new Array(5).fill(null).map((_, index: number) => ({
        id: faker.random.numeric(3),
        uuid: faker.datatype.uuid(),
        si_measurement_units_id: index,
        name: faker.random.alpha(10),
        code: faker.random.alpha(6),
        biological_reference_intervals: faker.random.alpha(10),
        notes: faker.random.alpha(20),
        options: null,
        type_id: 1,
        type_view_id: index,
        is_printable: true,
        is_required: true,
        ...props,
    }));

export const MOCKED_NEW_PARAMETER = {
    si_measurement_units_id: 1,
    name: faker.random.alpha(10),
    code: faker.random.alpha(6),
    biological_reference_intervals: faker.random.alpha(10),
    notes: faker.random.alpha(20),
    options: null,
    type_id: 1,
    type_view_id: 3,
    is_printable: false,
    is_required: false,
};

export const MOCKED_SHORT_PARAMETER = (props = {}) => ({
    name: faker.random.alpha(10),
    code: faker.random.alpha(6),
    id: faker.datatype.number(),
    uuid: faker.datatype.uuid(),
    ...props,
});

export const MOCKED_PARAMETER_OPTIONS_IDS = new Array(5).fill(null).map((_, index: number) => index);
export const MOCKED_PARAMETER_OPTIONS = MOCKED_PARAMETER_OPTIONS_IDS.map(id => ({
    id,
    name: faker.random.alpha(10),
}));
