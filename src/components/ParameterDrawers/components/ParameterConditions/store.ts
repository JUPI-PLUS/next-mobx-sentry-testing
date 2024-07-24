// libs
import { createContext, useContext } from "react";
import { action, computed, makeObservable, observable } from "mobx";
import uniqueId from "lodash/uniqueId";
import isNull from "lodash/isNull";
import isEmpty from "lodash/isEmpty";

// helpers
import { isConditionGroupHasErrors, isIntervalValueHasError } from "./utils";

// models
import {
    ServerParameterConditionGroups,
    ParameterConditionTypeDictionaryItemLookup,
    ConditionGroup,
    ConditionGroupErrors,
    ConditionOperator,
    ValuesValidation,
    ConditionsValidation,
} from "./models";
import { ID } from "../../../../shared/models/common";
import { Lookup } from "../../../../shared/models/form";

// constants
import { DEFAULT_REFERENCE_COLOR } from "./constants";

const DEFAULT_CONDITION_GROUP: ConditionGroup = {
    id: uniqueId(),
    isDefault: true,
    isAddIntervalDisabled: false,
    conditions: [],
    values: [
        {
            from: null,
            to: null,
            color: DEFAULT_REFERENCE_COLOR.value,
            isNormal: true,
            note: "",
            title: "",
        },
    ],
};

const DEFAULT_CONDITION_ERROR: ConditionGroupErrors = {
    conditions: [{ isValueFrom: false, isValueTo: false, isType: false, index: 0 }],
    values: [{ isValueTo: false, isValueFrom: false, index: 0, isTitle: false }],
};

class ParameterConditionsStore {
    @observable private _conditionGroups: ConditionGroup[] = [DEFAULT_CONDITION_GROUP];
    @observable private _disabledIntervals: Set<number> = new Set();
    @observable public conditionTypesLookup: ParameterConditionTypeDictionaryItemLookup[] = [];
    @observable public referenceColorsLookup: Lookup<ID>[] = [];
    @observable public movedConditionsIds: string[] = [];
    @observable private _conditionGroupErrors: ConditionGroupErrors[] = [DEFAULT_CONDITION_ERROR];
    @observable public isConditionsFetched = false;
    @observable public isConditionsChanged = false;

    constructor() {
        makeObservable(this);
    }

    @action.bound
    addConditionGroup() {
        const tail = this._conditionGroups.splice(-1);
        const errorsTail = this._conditionGroupErrors.splice(-1);
        this._conditionGroups.push({
            id: uniqueId(),
            isDefault: false,
            isAddIntervalDisabled: false,
            conditions: [
                {
                    id: uniqueId(),
                    typeId: undefined,
                    valueTo: null,
                    valueFrom: null,
                    operator: ConditionOperator.EQUAL,
                },
            ],
            values: [
                {
                    from: null,
                    to: null,
                    color: DEFAULT_REFERENCE_COLOR.value,
                    note: "",
                    title: "",
                    isNormal: true,
                },
            ],
        });
        this._conditionGroupErrors.push({
            conditions: [{ isValueFrom: false, isValueTo: false, isType: false, index: 0 }],
            values: [{ isValueTo: false, isValueFrom: false, index: 0, isTitle: false }],
        });
        errorsTail[0] && this._conditionGroupErrors.push(errorsTail[0]);
        tail[0] && this._conditionGroups.push(tail[0]);

        this.isConditionsChanged = true;
    }

    @action.bound
    deleteConditionGroup(id: string) {
        const index = this._conditionGroups.findIndex(condition => condition.id === id);
        const start = this._conditionGroups.slice(0, index);
        const end = this._conditionGroups.slice(index + 1);
        const startErrors = this._conditionGroupErrors.slice(0, index);
        const endErrors = this._conditionGroupErrors.slice(index + 1);

        this._conditionGroups = [...start, ...end];
        this._conditionGroupErrors = [...startErrors, ...endErrors];

        this.isConditionsChanged = true;
    }

    @action.bound
    moveConditionGroup(id: string, index: number, nextIndex: number) {
        const draft = this._conditionGroups.slice(0);
        this._conditionGroups.splice(index, 1);
        this._conditionGroups.splice(nextIndex, 0, draft[index]);

        const draftErrors = this._conditionGroupErrors.slice(0);
        this._conditionGroupErrors.splice(index, 1);
        this._conditionGroupErrors.splice(nextIndex, 0, draftErrors[index]);

        this.isConditionsChanged = true;
    }

    @action.bound
    setupMovedConditionGroupId(groupId: string) {
        this.movedConditionsIds.push(groupId);
    }

    @action.bound
    removeMovedConditionGroups() {
        this.movedConditionsIds = [];
    }

    @action.bound
    copyConditionGroup(copiedId: string) {
        const foundConditionGroup = this._conditionGroups.find(condition => condition.id === copiedId)!;
        const foundConditionGroupIndex = this._conditionGroups.findIndex(condition => condition.id === copiedId)!;
        const tail = this._conditionGroups.splice(-1);
        this._conditionGroups.push({
            ...foundConditionGroup,
            values: foundConditionGroup.values.map(it => ({ ...it })), // Cause we dont need to save link of prev object
            conditions: foundConditionGroup.conditions.map(it => ({ ...it })), // Cause we dont need to save link of prev object
            id: uniqueId(),
        });
        this._conditionGroups.push(tail[0]);

        if (this._conditionGroupErrors.length) {
            const foundConditionGroupErrors = this._conditionGroupErrors[foundConditionGroupIndex];
            const tailError = this._conditionGroupErrors.splice(-1);
            this._conditionGroupErrors.push({ ...foundConditionGroupErrors });
            this._conditionGroupErrors.push(tailError[0]);
        }
        this.isConditionsChanged = true;
    }

    @action.bound
    addConditionRow(conditionGroupIndex: number) {
        this._conditionGroups[conditionGroupIndex].conditions.push({
            id: uniqueId(),
            typeId: undefined,
            operator: ConditionOperator.EQUAL,
            valueFrom: null,
            valueTo: null,
        });
        this._conditionGroupErrors[conditionGroupIndex].conditions.push({
            index: this._conditionGroups[conditionGroupIndex].conditions.length - 1,
            isType: false,
            isValueTo: false,
            isValueFrom: false,
        });

        this.isConditionsChanged = true;
    }

    @action.bound
    deleteConditionRow(conditionRowId: string, conditionGroupIndex: number) {
        const index = this._conditionGroups[conditionGroupIndex].conditions.findIndex(
            conditionRow => conditionRow.id === conditionRowId
        );
        const start = this._conditionGroups[conditionGroupIndex].conditions.slice(0, index);
        const end = this._conditionGroups[conditionGroupIndex].conditions.slice(index + 1);
        this._conditionGroups[conditionGroupIndex].conditions = [...start, ...end];

        this.isConditionsChanged = true;
    }

    @action.bound
    setupConditionType(
        typeId: number | undefined,
        hasAlias: boolean,
        conditionGroupIndex: number,
        conditionRowId: number
    ) {
        this._conditionGroups[conditionGroupIndex].conditions[conditionRowId].typeId = typeId;
        this._conditionGroups[conditionGroupIndex].conditions[conditionRowId].operator = hasAlias
            ? ConditionOperator.EQUAL
            : ConditionOperator.BETWEEN;

        this.isConditionsChanged = true;
    }

    @action.bound
    setupConditionValue(
        type: "valueFrom" | "valueTo",
        value: number | null,
        conditionGroupIndex: number,
        conditionRowId: number
    ) {
        this._conditionGroups[conditionGroupIndex].conditions[conditionRowId][type] = value;

        this.isConditionsChanged = true;
    }

    @action.bound
    addIntervalRow(conditionGroupIndex: number) {
        this._conditionGroups[conditionGroupIndex].values.push({
            note: "",
            title: "",
            isNormal: false,
            color: DEFAULT_REFERENCE_COLOR.value,
            to: null,
            from: this._conditionGroups[conditionGroupIndex].values.at(-1)?.to ?? 0,
        });

        this.isConditionsChanged = true;
    }

    @action.bound
    deleteIntervalRow(conditionGroupIndex: number, rowIndex: number) {
        const toDelete = this._conditionGroups[conditionGroupIndex].values[rowIndex];
        const start = this._conditionGroups[conditionGroupIndex].values.slice(0, rowIndex);
        const end = this._conditionGroups[conditionGroupIndex].values.slice(rowIndex + 1);
        this._conditionGroups[conditionGroupIndex].values = [...start, ...end];
        if (toDelete.isNormal) {
            this._conditionGroups[conditionGroupIndex].values[0].isNormal = true;
        }

        this.isConditionsChanged = true;
    }

    @action.bound
    setupConditionTypesLookup(lookup: ParameterConditionTypeDictionaryItemLookup[]) {
        this.conditionTypesLookup = lookup;
    }

    @action.bound
    setupReferenceColorsLookup(lookup: Lookup<ID>[]) {
        this.referenceColorsLookup = lookup;
    }

    @action.bound
    setupIntervalValueTitle(value: string, conditionGroupIndex: number, intervalIndex: number) {
        this._conditionGroups[conditionGroupIndex].values[intervalIndex].title = value;

        this.isConditionsChanged = true;
    }

    @action.bound
    setupIntervalColor(value: ID, conditionGroupIndex: number, intervalIndex: number) {
        this._conditionGroups[conditionGroupIndex].values[intervalIndex].color = value;

        this.isConditionsChanged = true;
    }

    @action.bound
    setupIntervalValueNotes(value: string, conditionGroupIndex: number, intervalIndex: number) {
        this._conditionGroups[conditionGroupIndex].values[intervalIndex].note = value;

        this.isConditionsChanged = true;
    }

    @action.bound
    setupIntervalNormalValue(isNormal: boolean, conditionGroupIndex: number, intervalIndex: number) {
        this._conditionGroups[conditionGroupIndex].values.forEach(interval => (interval.isNormal = false));
        this._conditionGroups[conditionGroupIndex].values[intervalIndex].isNormal = isNormal;

        this.isConditionsChanged = true;
    }

    @action.bound
    setupIntervalValue(type: "from" | "to", value: number | null, conditionGroupIndex: number, intervalIndex: number) {
        this._conditionGroups[conditionGroupIndex].values[intervalIndex][type] = value;

        this.isConditionsChanged = true;
    }

    @action.bound
    setupDisabledIntervals(conditionGroupIndex: number) {
        this._disabledIntervals.add(conditionGroupIndex);
    }

    @action.bound
    removeDisabledIntervals(conditionGroupIndex: number) {
        this._disabledIntervals.delete(conditionGroupIndex);
    }

    @action.bound
    revalidateDisabledIntervals(conditionGroupIndex: number) {
        const isSomeIntervalInvalid = this._conditionGroups[conditionGroupIndex].values.some(({ from, to }) => {
            // TODO: Check title
            return isNull(to) || isNull(from) || from > to;
        });

        if (isSomeIntervalInvalid) {
            this.setupDisabledIntervals(conditionGroupIndex);
        } else {
            this.removeDisabledIntervals(conditionGroupIndex);
        }
    }

    @action.bound
    recalculateNextValues(type: "from" | "to", value: number, conditionGroupIndex: number, intervalIndex: number) {
        this._conditionGroups[conditionGroupIndex].values.slice(intervalIndex).forEach((interval, index, array) => {
            if (index === 0) {
                if (type === "from" && value > (interval?.to ?? 0)) {
                    interval.to = value;
                }

                if (type === "to" && value < (interval?.from ?? 0)) {
                    this.setupDisabledIntervals(conditionGroupIndex);
                }
                return;
            }

            const prevToValue = array[index - 1].to;
            if (!isNull(interval.from) && !isNull(prevToValue) && prevToValue !== interval.from) {
                interval.from = prevToValue;
            }

            if (!isNull(interval.to) && !isNull(interval.from) && interval.from > interval.to) {
                interval.to = value;
            }
        });
    }

    @action.bound
    clearConditionValidation() {
        this._conditionGroupErrors = [];
    }

    @action.bound
    validateConditionGroups() {
        this._conditionGroups.forEach((group, groupIndex) => {
            const incorrectConditionIndexes: ConditionsValidation[] = [];
            const incorrectValueIndexes: ValuesValidation[] = [];
            group.conditions.forEach((condition, conditionIndex) => {
                if (!condition.typeId) {
                    incorrectConditionIndexes.push({
                        index: conditionIndex,
                        isType: true,
                        isValueFrom: false,
                        isValueTo: false,
                    });
                    return;
                }

                if (condition.operator === ConditionOperator.EQUAL) {
                    incorrectConditionIndexes.push({
                        index: conditionIndex,
                        isType: false,
                        isValueFrom: isNull(condition.valueFrom),
                        isValueTo: false,
                    });
                    return;
                }

                if (condition.operator === ConditionOperator.BETWEEN) {
                    incorrectConditionIndexes.push({
                        index: conditionIndex,
                        isType: false,
                        isValueFrom:
                            isNull(condition.valueFrom) ||
                            (Number(condition?.valueTo) ?? 0) < (Number(condition?.valueFrom) ?? 0),
                        isValueTo:
                            isNull(condition.valueTo) ||
                            (Number(condition?.valueTo) ?? 0) < (Number(condition?.valueFrom) ?? 0),
                    });
                }
            });

            group.values.forEach((value, valueIndex) => {
                if (valueIndex === 0) {
                    incorrectValueIndexes.push({
                        isValueFrom: isNull(value.from) || (Number(value?.to) ?? 0) < (Number(value?.from) ?? 0),
                        isValueTo: isNull(value.to) || (Number(value?.to) ?? 0) < (Number(value?.from) ?? 0),
                        isTitle: isNull(value.title) || isEmpty(value.title),
                        index: valueIndex,
                    });
                    return;
                }

                incorrectValueIndexes.push({
                    isValueFrom: false,
                    isValueTo: isNull(value.to) || (Number(value?.to) ?? 0) < (Number(value?.from) ?? 0),
                    isTitle: isNull(value.title) || isEmpty(value.title),
                    index: valueIndex,
                });
            });

            if (incorrectConditionIndexes.length || incorrectValueIndexes.length) {
                this._conditionGroupErrors[groupIndex] = {
                    conditions: incorrectConditionIndexes,
                    values: incorrectValueIndexes,
                };
            }
        });
    }

    @action.bound
    resetValueValidation(conditionGroupIndex: number, intervalIndex: number, accessor: "isValueFrom" | "isValueTo") {
        if (this._conditionGroupErrors[conditionGroupIndex]?.values[intervalIndex]?.[accessor]) {
            this._conditionGroupErrors[conditionGroupIndex].values[intervalIndex][accessor] = false;
        }
    }

    @action.bound
    resetConditionValidation(
        conditionGroupIndex: number,
        conditionRowIndex: number,
        operator: ConditionOperator,
        accessor: "isValueFrom" | "isValueTo" | "isType"
    ) {
        if (this._conditionGroupErrors[conditionGroupIndex]?.conditions[conditionRowIndex]?.[accessor]) {
            this._conditionGroupErrors[conditionGroupIndex].conditions[conditionRowIndex][accessor] = false;
        }
    }

    @action.bound
    setupInitialConditions(parameterConditions: ServerParameterConditionGroups[]) {
        // Do not need to refetch already fetched conditions. By clicking back button and after click on continue will refetch conditions and will clean already filled data;
        if (this.isConditionsFetched) return;

        if (!parameterConditions.length) {
            this._conditionGroups = [DEFAULT_CONDITION_GROUP];
            return;
        }

        this._conditionGroups = parameterConditions.map(({ conditions, values, is_default }) => ({
            isDefault: is_default,
            id: uniqueId(),
            conditions: conditions.map(({ operator, type_id, value_to, value_from }) => ({
                valueFrom: value_from,
                valueTo: value_to,
                id: uniqueId(),
                typeId: type_id,
                operator,
            })),
            values: values.map(({ is_normal, ...rest }) => ({ isNormal: is_normal, ...rest })),
            isAddIntervalDisabled: false,
        }));
    }

    @action.bound
    setupIsConditionsFetched() {
        this.isConditionsFetched = true;
    }

    @action.bound
    cleanup() {
        this._conditionGroups = [DEFAULT_CONDITION_GROUP];
        this._conditionGroupErrors = [];
        this._disabledIntervals = new Set();
        this.movedConditionsIds = [];
        this.isConditionsFetched = false;
        this.isConditionsChanged = false;
    }

    @computed
    get disabledIntervals() {
        return this._disabledIntervals;
    }

    @computed
    get conditionGroups() {
        return this._conditionGroups;
    }

    @computed
    get conditionGroupErrors() {
        return this._conditionGroupErrors;
    }

    @computed get hasErrors() {
        return Boolean(this.conditionGroupErrors.length);
    }

    haveConditionsErrors = () => {
        return this._conditionGroupErrors.some(({ conditions, values }) =>
            isConditionGroupHasErrors({ conditions, values })
        );
    };

    isIntervalHasErrors = (
        conditionGroupIndex: number,
        intervalIndex: number,
        type: "isValueFrom" | "isValueTo" | "isTitle"
    ) => {
        return isIntervalValueHasError(
            this._conditionGroupErrors[conditionGroupIndex]?.values?.[intervalIndex] ?? null,
            type
        );
    };

    isConditionGroupHasError = (conditionGroupIndex: number) => {
        return isConditionGroupHasErrors(this._conditionGroupErrors[conditionGroupIndex]);
    };
}

export const ParameterConditionsStoreContext = createContext({
    parameterConditionsStore: new ParameterConditionsStore(),
});

interface ParameterConditionsStoreContextValue {
    parameterConditionsStore: ParameterConditionsStore;
}

export const useParameterConditionsStore = (): ParameterConditionsStoreContextValue =>
    useContext(ParameterConditionsStoreContext);
