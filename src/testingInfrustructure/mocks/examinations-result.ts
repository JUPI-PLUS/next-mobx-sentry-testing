// libs
import { faker } from "@faker-js/faker";

// models
import { ParameterViewTypeEnum, UrgencyStatus } from "../../shared/models/business/enums";

// mocks
import { MOCKED_PARAMETER_OPTIONS } from "./parameters";

export const MOCKED_MEASURE_UNITS_LOOKUP = new Array(5).fill(null).map((_, index) => ({
    id: index,
    name: faker.random.alpha(10),
}));

export const MOCKED_SAMPLE_STATUSES_LOOKUP = new Array(5).fill(null).map((_, index) => ({
    id: index,
    name: faker.random.alpha(10),
}));

export const MOCKED_SAMPLE_TYPES_LOOKUP = new Array(5).fill(null).map((_, index) => ({
    id: index,
    name: faker.random.alpha(10),
}));

export const MOCKED_CONDITION_TYPES_LOOKUP = new Array(5).fill(null).map((_, index) => ({
    id: index,
    name: faker.random.alpha(10),
}));

export const MOCKED_EXAM_TEMPLATES_LOOKUP = new Array(5).fill(null).map((_, index) => ({
    id: index + 1,
    name: faker.random.alpha(10),
}));

export const MOCKED_REFERENCE_VALUES = [
    {
        color: 1,
        from: 0,
        to: 100,
        title: faker.random.alpha(10),
        note: faker.random.alpha(50),
        is_normal: true,
    },
    {
        color: 2,
        from: 100,
        to: 200,
        title: faker.random.alpha(10),
        note: faker.random.alpha(50),
        is_normal: false,
    },
    {
        color: 3,
        from: 200,
        to: 300,
        title: faker.random.alpha(10),
        note: faker.random.alpha(50),
        is_normal: false,
    },
    {
        color: 4,
        from: 300,
        to: 700,
        title: faker.random.alpha(10),
        note: faker.random.alpha(50),
        is_normal: false,
    },
];

export const MOCKED_PARAMS = [
    {
        biological_reference_intervals: faker.random.alpha(20),
        name: faker.random.alpha(20),
        si_measurement_units_id: faker.helpers.arrayElement(MOCKED_MEASURE_UNITS_LOOKUP).id,
        type: "",
        uuid: faker.datatype.uuid(),
        value: faker.random.alpha(10),
        type_view_id: ParameterViewTypeEnum.STRING,
        reference_values: null,
        result_notes: null,
        options: null,
    },
    {
        biological_reference_intervals: faker.random.alpha(20),
        name: faker.random.alpha(20),
        si_measurement_units_id: faker.helpers.arrayElement(MOCKED_MEASURE_UNITS_LOOKUP).id,
        type: "",
        uuid: faker.datatype.uuid(),
        value: String(MOCKED_REFERENCE_VALUES[2].from),
        type_view_id: ParameterViewTypeEnum.NUMBER,
        reference_values: MOCKED_REFERENCE_VALUES,
        result_notes: null,
        options: null,
    },
    {
        biological_reference_intervals: faker.random.alpha(20),
        name: faker.random.alpha(20),
        si_measurement_units_id: faker.helpers.arrayElement(MOCKED_MEASURE_UNITS_LOOKUP).id,
        type: "",
        uuid: faker.datatype.uuid(),
        value: MOCKED_PARAMETER_OPTIONS[0].name,
        type_view_id: ParameterViewTypeEnum.DROPDOWN_STRICT,
        reference_values: null,
        result_notes: faker.random.alpha(50),
        options: MOCKED_PARAMETER_OPTIONS,
    },
    {
        biological_reference_intervals: faker.random.alpha(20),
        name: faker.random.alpha(20),
        si_measurement_units_id: faker.helpers.arrayElement(MOCKED_MEASURE_UNITS_LOOKUP).id,
        type: "",
        uuid: faker.datatype.uuid(),
        value: null,
        type_view_id: ParameterViewTypeEnum.DROPDOWN_UNSTRICT,
        reference_values: null,
        result_notes: faker.random.alpha(50),
        options: MOCKED_PARAMETER_OPTIONS,
    },
    {
        biological_reference_intervals: faker.random.alpha(20),
        name: faker.random.alpha(20),
        si_measurement_units_id: faker.helpers.arrayElement(MOCKED_MEASURE_UNITS_LOOKUP).id,
        type: "",
        uuid: faker.datatype.uuid(),
        value: `${MOCKED_PARAMETER_OPTIONS[0].name};${MOCKED_PARAMETER_OPTIONS[1].name}`,
        type_view_id: ParameterViewTypeEnum.DROPDOWN_MULTISELECT,
        reference_values: null,
        result_notes: faker.random.alpha(50),
        options: MOCKED_PARAMETER_OPTIONS,
    },
];

export const MOCKED_EXAMS = (examsLength = 7, statusId?: number) =>
    new Array(examsLength).fill(null).map((_, index) => ({
        name: faker.random.alpha(35),
        params: MOCKED_PARAMS,
        notes: null,
        status_id: statusId || index + 1,
        urgency_id: UrgencyStatus.NORMAL,
        uuid: faker.datatype.uuid(),
    }));

export const MOCKED_EXAMINATIONS_BY_SAMPLE = (ordersLength = 1, examsLength = 7) =>
    new Array(ordersLength).fill(null).map(() => ({
        exams: MOCKED_EXAMS(examsLength),
        order_notes: faker.random.alpha(40),
        order_number: faker.random.numeric(10),
        order_uuid: faker.datatype.uuid(),
    }));

export const MOCKED_SAMPLE = {
    exams: MOCKED_EXAMS(1),
    order_notes: faker.random.alpha(40),
    order_number: faker.random.numeric(10),
    order_uuid: faker.datatype.uuid(),
};

export const MOCKED_SAMPLES_WITH_STATUS_NEW = [
    {
        ...MOCKED_SAMPLE,
        exams: MOCKED_EXAMS(1, 1),
    },
];

export const MOCKED_SAMPLES_WITH_STATUS_ON_VALIDATION = [
    {
        ...MOCKED_SAMPLE,
        exams: MOCKED_EXAMS(1, 4),
    },
];

export const MOCKED_SAMPLES_WITH_STATUS_DONE = [
    {
        ...MOCKED_SAMPLE,
        exams: MOCKED_EXAMS(1, 6),
    },
];

export const MOCKED_SAMPLES = new Array(5).fill(null).map((_, index) => ({
    id: index,
    uuid: faker.datatype.uuid(),
    barcode: faker.random.numeric(10),
    expire_date_timestamp: faker.date.soon(),
    sampling_datetime_timestamp: faker.date.recent(),
    volume: faker.datatype.number({ min: 1000, max: 9999 }),
    si_measurement_units_id: faker.helpers.arrayElement(MOCKED_MEASURE_UNITS_LOOKUP).id,
    sample_statuses_id: faker.helpers.arrayElement(MOCKED_SAMPLE_STATUSES_LOOKUP).id,
    type_id: MOCKED_SAMPLE_TYPES_LOOKUP[index].id,
    user_uuid: faker.datatype.uuid(),
    created_at_timestamp: faker.date.recent().getMilliseconds(),
    updated_at_timestamp: faker.date.recent().getMilliseconds(),
    exams: MOCKED_EXAMS(),
}));
