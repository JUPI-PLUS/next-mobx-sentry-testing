import {
    ConditionGroup,
    ConditionGroupErrors,
    ConditionsValidation,
    ServerParameterConditionGroups,
    ValuesValidation,
} from "./models";

export const isConditionGroupHasErrors = (conditionGroupErrors: ConditionGroupErrors | null) => {
    if (!conditionGroupErrors) return false;
    if (
        conditionGroupErrors.conditions.some(({ isValueFrom, isValueTo, isType }) => isValueFrom || isValueTo || isType)
    ) {
        return true;
    }

    return conditionGroupErrors.values.some(
        ({ isValueFrom, isValueTo, isTitle }) => isValueFrom || isValueTo || isTitle
    );
};

export const isConditionTypeHasError = (
    conditionGroupErrors: ConditionGroupErrors | null,
    conditionRowIndex: number
) => {
    if (!conditionGroupErrors) return false;
    return conditionGroupErrors.conditions[conditionRowIndex]?.isType;
};

export const isConditionValueHasError = (
    conditionValidation: ConditionsValidation | null,
    valueAccessor: "isValueFrom" | "isValueTo"
) => {
    if (!conditionValidation) return false;
    return conditionValidation[valueAccessor];
};

export const isIntervalValueHasError = (
    intervalValidation: ValuesValidation | null,
    valueAccessor: "isValueFrom" | "isValueTo" | "isTitle"
) => {
    if (!intervalValidation) return false;
    return intervalValidation[valueAccessor];
};

export const prepareConditionsToSend = (conditionGroups: ConditionGroup[]): ServerParameterConditionGroups[] => {
    return conditionGroups.map(({ conditions, values, isDefault }) => ({
        is_default: isDefault,
        conditions: conditions.map(({ operator, typeId, valueTo, valueFrom }) => ({
            operator,
            type_id: typeId as number,
            value_from: valueFrom as number,
            value_to: valueTo,
        })),
        values: values.map(({ isNormal, from, ...rest }) => ({
            from: from as number,
            is_normal: isNormal,
            ...rest,
        })),
    }));
};
