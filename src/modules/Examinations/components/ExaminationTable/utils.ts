// libs
import uniqueId from "lodash/uniqueId";

// helpers
import { getPatientAge } from "../../../../shared/utils/date";
import { getLookupItem } from "../../../../shared/utils/lookups";
import { isValueReal } from "../../../../shared/utils/common";
import { isValueInRange } from "../../../../components/uiKit/ProgressBar/Stacked/utils";

// models
import {
    ExaminationBySample,
    OrdersConditionBySample,
    ReferenceValue,
    ReferenceValueMaybeHasMarker,
} from "../../models";
import { Patient } from "../../../../shared/models/business/user";
import { Lookup } from "../../../../shared/models/form";
import { ID } from "../../../../shared/models/common";
import { ConditionTypesEnum } from "../../../../components/ParameterDrawers/components/ParameterConditions/models";

// constants
import { MAX_DAYS_IN_YEAR, MIN_AGE_IN_YEARS } from "./constants";

export const getGroupedConditionsByType = (ordersConditionsBySample: OrdersConditionBySample[]) =>
    ordersConditionsBySample.reduce<{
        filteredConditions: OrdersConditionBySample[];
        ageConditions: OrdersConditionBySample[];
        sexConditions: OrdersConditionBySample[];
    }>(
        (acc, condition) => {
            switch (condition.id) {
                case ConditionTypesEnum.SEX:
                    acc.sexConditions.push(condition);
                    return acc;
                case ConditionTypesEnum.AGE_YEARS:
                case ConditionTypesEnum.AGE_DAYS:
                    acc.ageConditions.push(condition);
                    return acc;
                default:
                    acc.filteredConditions.push(condition);
                    return acc;
            }
        },
        { filteredConditions: [], ageConditions: [], sexConditions: [] }
    );

export const getInitialAgeCondition = (ageConditions: OrdersConditionBySample[]) => {
    for (const ageCondition of ageConditions) {
        if (ageCondition.id === ConditionTypesEnum.AGE_YEARS && ageCondition.value >= MIN_AGE_IN_YEARS) {
            return ageCondition;
        }

        if (ageCondition.id === ConditionTypesEnum.AGE_DAYS && ageCondition.value <= MAX_DAYS_IN_YEAR) {
            return ageCondition;
        }
    }
    return null;
};

const getAgeCondition = (
    ageConditions: OrdersConditionBySample[],
    patient: Patient,
    conditionTypesLookup: Lookup<ID>[]
) => {
    if (!patient.birth_date) return null;

    const initialAgeCondition = getInitialAgeCondition(ageConditions);

    if (initialAgeCondition) return initialAgeCondition;

    const patientAge = getPatientAge(patient.birth_date, "years");
    const isPatientOlderThanOneYear = patientAge >= 1;
    const ageConditionName =
        getLookupItem(
            conditionTypesLookup,
            isPatientOlderThanOneYear ? ConditionTypesEnum.AGE_YEARS : ConditionTypesEnum.AGE_DAYS
        )?.label || "";
    return {
        id: isPatientOlderThanOneYear ? ConditionTypesEnum.AGE_YEARS : ConditionTypesEnum.AGE_DAYS,
        value: isPatientOlderThanOneYear ? patientAge : getPatientAge(patient.birth_date, "days"),
        name: ageConditionName,
    };
};

const getSexCondition = (
    sexConditions: OrdersConditionBySample[],
    patient: Patient,
    sexTypesLookup: Lookup<ID>[],
    conditionTypesLookup: Lookup<ID>[]
) => {
    if (!patient.sex_id) return null;

    return (
        sexConditions[0] || {
            id: ConditionTypesEnum.SEX,
            value: getLookupItem(sexTypesLookup, patient.sex_id)?.label || "",
            name: getLookupItem(conditionTypesLookup, ConditionTypesEnum.SEX)?.label || "",
        }
    );
};

export const getTransformedOrdersConditions = (
    ordersConditionsBySample: OrdersConditionBySample[],
    patient: Patient,
    sexTypesLookup: Lookup<ID>[],
    conditionTypesLookup: Lookup<ID>[]
) => {
    const { filteredConditions, ageConditions, sexConditions } = getGroupedConditionsByType(ordersConditionsBySample);

    let ordersConditions = filteredConditions;

    const ageCondition = getAgeCondition(ageConditions, patient, conditionTypesLookup);
    if (ageCondition) {
        ordersConditions = [ageCondition, ...ordersConditions];
    }

    const sexCondition = getSexCondition(sexConditions, patient, sexTypesLookup, conditionTypesLookup);
    if (sexCondition) {
        ordersConditions = [sexCondition, ...ordersConditions];
    }

    return ordersConditions;
};

export const filterExamTemplatesByIds = (examinations: ExaminationBySample[], examinationTemplateIds: ID[]) => {
    if (!examinationTemplateIds.length) return examinations;

    return examinations.reduce<ExaminationBySample[]>((acc, next) => {
        const exams = next.exams.filter(row => examinationTemplateIds.includes(row.exam_template_id));
        return !exams.length
            ? acc
            : [
                  ...acc,
                  {
                      ...next,
                      exams,
                  },
              ];
    }, []);
};

export const isValueInInterval = (value: number, from: number, to: number, bars: Array<ReferenceValue>) => {
    if (!isValueReal(value) || !bars.length) return false;

    return isValueInRange(from, to, value);
};

export const transformReferenceValues = (
    value: number,
    referenceValues: ReferenceValue[],
    referenceColorsLookup: Lookup<ID>[]
) =>
    referenceValues.reduce<ReferenceValueMaybeHasMarker[]>((acc, item, _, array) => {
        return [
            ...acc,
            {
                ...item,
                keyId: uniqueId(item.from.toString()),
                color: "#" + getLookupItem(referenceColorsLookup, item.color)?.label,
                hasMarker: !acc.find(referenceValue => referenceValue.hasMarker)
                    ? isValueInInterval(value, item.from, item.to, array)
                    : false,
            },
        ];
    }, []);
