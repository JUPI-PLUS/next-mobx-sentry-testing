// libs
import { faker } from "@faker-js/faker";

// mocks
import { MOCKED_EXAM_TEMPLATE_STATUSES, MOCKED_MEASUREMENT_UNITS, MOCKED_SAMPLE_TYPES } from "./dictionaries";
import { MOCKED_PARAMETERS } from "./parameters";

export const MOCKED_EXAM_TEMPLATE_INPUT_VALUES = {
    name: faker.random.alpha(10),
    code: faker.random.alpha(10),
    term: faker.random.numeric(2),
    sample_types_id: MOCKED_SAMPLE_TYPES[1].name,
    si_measurement_units_id: MOCKED_MEASUREMENT_UNITS[1].name,
    volume: faker.random.numeric(2),
    preparation: faker.random.alpha(100),
    description: faker.random.alpha(200),
    status_id: MOCKED_EXAM_TEMPLATE_STATUSES[1].name,
    sample_prefix: faker.random.numeric(1),
};

export const MOCKED_EXAM_TEMPLATE_GENERAL_INFO = {
    ...MOCKED_EXAM_TEMPLATE_INPUT_VALUES,
    term: Number(MOCKED_EXAM_TEMPLATE_INPUT_VALUES.term),
    volume: Number(MOCKED_EXAM_TEMPLATE_INPUT_VALUES.volume),
    sample_prefix: Number(MOCKED_EXAM_TEMPLATE_INPUT_VALUES.sample_prefix),
    sample_types_id: MOCKED_SAMPLE_TYPES[1].id,
    si_measurement_units_id: MOCKED_MEASUREMENT_UNITS[1].id,
    status_id: MOCKED_EXAM_TEMPLATE_STATUSES[1].id,
    uuid: faker.datatype.uuid(),
    parent_group_uuid: "",
};

export const MOCKED_EXAM_TEMPLATE_PARAMETERS = [
    {
        group_uuid: faker.datatype.uuid(),
        group_name: faker.random.alpha(10),
        params: null,
    },
    {
        group_uuid: faker.datatype.uuid(),
        group_name: faker.random.alpha(10),
        params: MOCKED_PARAMETERS(),
    },
    {
        group_uuid: null,
        group_name: null,
        params: MOCKED_PARAMETERS(),
    },
];
