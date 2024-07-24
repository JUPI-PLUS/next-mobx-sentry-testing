// libs
import { faker } from "@faker-js/faker";

// models
import { CommonDictionaryItem } from "../../shared/models/dictionaries";
import { OrderConditionResponse } from "../../modules/CreateOrder/models";
import { ConditionTypesEnum } from "../../components/ParameterDrawers/components/ParameterConditions/models";

// mocks
import { MOCKED_SEX_TYPES } from "./dictionaries";

// ORDER CONDITIONS
export const MOCKED_ORDER_CONDITIONS_OPTION = (): CommonDictionaryItem => ({
    id: faker.random.numeric(2),
    name: faker.random.alpha(10),
});
export const MOCKED_ORDER_CONDITIONS_OPTIONS = () => new Array(10).fill(0).map(() => MOCKED_ORDER_CONDITIONS_OPTION());

export const MOCKED_ORDER_CONDITION = (operator = 1): OrderConditionResponse => ({
    id: Number(faker.random.numeric(2)),
    name: faker.random.alpha(10),
    operator,
    options: MOCKED_ORDER_CONDITIONS_OPTIONS(),
});

export const MOCKED_ORDER_CONDITIONS = new Array(10).fill(0).map(() => MOCKED_ORDER_CONDITION());

// ORDER CONDITIONS BY SAMPLE
export const MOCKED_ORDER_CONDITIONS_BY_SAMPLE = [
    { id: ConditionTypesEnum.PREGNANCY, name: faker.random.alpha(10), value: faker.random.alpha(10) },
    { id: ConditionTypesEnum.MENSTRUAL_CYCLE_PHASE, name: faker.random.alpha(10), value: faker.random.alpha(10) },
    { id: ConditionTypesEnum.MENOPAUSE_PHASE, name: faker.random.alpha(10), value: faker.random.alpha(10) },
    { id: ConditionTypesEnum.PREGNANCY_TRIMESTER, name: faker.random.alpha(10), value: faker.random.alpha(10) },
];

export const MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_SEX = {
    id: ConditionTypesEnum.SEX,
    name: faker.random.alpha(10),
    value: faker.helpers.arrayElement(MOCKED_SEX_TYPES).name,
};

export const MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_YEARS = {
    id: ConditionTypesEnum.AGE_YEARS,
    name: faker.random.alpha(10),
    value: faker.random.numeric(2),
};

export const MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_YEARS_INVALID = {
    id: ConditionTypesEnum.AGE_YEARS,
    name: faker.random.alpha(10),
    value: 0.5,
};

export const MOCKED_ORDER_CONDITION_BY_SAMPLE_WITH_AGE_DAYS = {
    id: ConditionTypesEnum.AGE_DAYS,
    name: faker.random.alpha(10),
    value: faker.random.numeric(2),
};
