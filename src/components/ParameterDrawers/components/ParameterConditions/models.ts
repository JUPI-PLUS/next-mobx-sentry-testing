// models
import { ParameterConditionTypeDictionaryItem } from "../../../../shared/models/dictionaries";
import { Lookup } from "../../../../shared/models/form";
import { ID } from "../../../../shared/models/common";

export enum ConditionTypesEnum {
    SEX = 1,
    AGE_YEARS,
    AGE_DAYS,
    PREGNANCY,
    PREGNANCY_TRIMESTER,
    MENSTRUAL_CYCLE_PHASE,
    MENOPAUSE_PHASE,
}

export enum ConditionOperator {
    EQUAL = 1,
    BETWEEN,
}

export interface ServerParameterCondition {
    type_id: number;
    operator: ConditionOperator;
    value_from: number;
    value_to: number | null;
}

export interface ServerParameterInterval {
    from: number;
    to: number | null;
    color: ID;
    title: string;
    note: string;
    is_normal: boolean;
}

export interface ServerParameterConditionGroups {
    is_default: boolean;
    conditions: ServerParameterCondition[];
    values: ServerParameterInterval[];
}

export type ParameterConditionTypeDictionaryItemLookup = ParameterConditionTypeDictionaryItem & Lookup<number>;

export interface ParameterConditionsProps {
    parameterName: string | null;
    parameterUUID?: string;
    isEdit?: boolean;
}

export interface Condition {
    id: string;
    typeId: number | undefined;
    operator: ConditionOperator;
    valueFrom: number | null;
    valueTo: number | null;
}

export interface ConditionGroupValue {
    from: number | null;
    to: number | null;
    color: ID;
    title: string;
    note: string;
    isNormal: boolean;
}

export interface ConditionGroup {
    id: string;
    isDefault: boolean;
    isAddIntervalDisabled: boolean;
    conditions: Condition[];
    values: ConditionGroupValue[];
}

export interface ValuesValidation {
    index: number;
    isValueFrom: boolean;
    isValueTo: boolean;
    isTitle: boolean;
}

export interface ConditionsValidation {
    index: number;
    isType: boolean;
    isValueFrom: boolean;
    isValueTo: boolean;
}

export interface ConditionGroupErrors {
    conditions: ConditionsValidation[];
    values: ValuesValidation[];
}
