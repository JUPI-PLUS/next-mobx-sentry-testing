// libs
import React, { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { observer } from "mobx-react";

// components
import Select from "../../../../../../../../uiKit/forms/selects/Select/Select";
import MaskedNumberInput from "../../../../../../../../uiKit/forms/Inputs/MaskedInputs/FormMaskedNumberInput/MaskedNumberInput";

// models
import { Lookup } from "../../../../../../../../../shared/models/form";
import { ID } from "../../../../../../../../../shared/models/common";
import { ConditionOperator, ConditionTypesEnum } from "../../../../../models";
import { SingleValue } from "react-select/dist/declarations/src/types";
import { ConditionRowValueControlProps } from "./models";

// query keys
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../../../../shared/constants/queries";

// config
import { limsClient } from "../../../../../../../../../api/config";

// endpoints
import { DICTIONARIES_ENDPOINTS } from "../../../../../../../../../api/dictionaries/endpoints";

// helpers
import { getLookupItem, toLookupList } from "../../../../../../../../../shared/utils/lookups";
import { isConditionValueHasError } from "../../../../../utils";
import { getValidMaskedNumberValue } from "./utils";

// store
import { useParameterConditionsStore } from "../../../../../store";

// constants
import { MAX_SAFE_INTEGER } from "../../../../../../../../../shared/constants/common";
import { MAX_AGE_YEARS } from "../../../../../constants";

const ConditionRowValueControl: FC<ConditionRowValueControlProps> = ({
    label,
    pickedValue,
    conditionGroupIndex,
    conditionRowIndex,
}) => {
    const {
        parameterConditionsStore: {
            conditionGroups,
            conditionGroupErrors,
            hasErrors,
            resetConditionValidation,
            setupConditionValue,
        },
    } = useParameterConditionsStore();
    const [lookupValue, setLookupValue] = useState<Lookup<ID> | undefined>(undefined);
    const { data = [], isFetching } = useQuery(
        ["dictionaries", pickedValue?.alias],
        () => limsClient.get(`${DICTIONARIES_ENDPOINTS.root}/${pickedValue?.alias}`),
        {
            enabled: Boolean(pickedValue?.alias),
            select: queryData => toLookupList(queryData.data.data),
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
        }
    );

    const conditionRow = conditionGroups[conditionGroupIndex].conditions[conditionRowIndex];
    const conditionOperator = conditionRow.operator;

    const onSelectChange = (value: SingleValue<Lookup<ID>>) => {
        setLookupValue(value as Lookup<ID>);
        setupConditionValue("valueFrom", Number(value?.value) ?? null, conditionGroupIndex, conditionRowIndex);
        resetConditionValidation(conditionGroupIndex, conditionRowIndex, conditionOperator, "isValueFrom");
    };

    const onInputValueFromChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setupConditionValue("valueFrom", getValidMaskedNumberValue(value), conditionGroupIndex, conditionRowIndex);
        resetConditionValidation(conditionGroupIndex, conditionRowIndex, conditionOperator, "isValueFrom");
    };

    const onInputValueToChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setupConditionValue("valueTo", getValidMaskedNumberValue(value), conditionGroupIndex, conditionRowIndex);
        resetConditionValidation(conditionGroupIndex, conditionRowIndex, conditionOperator, "isValueTo");
    };

    const valueFrom = useMemo(() => {
        if (conditionRow.operator === ConditionOperator.BETWEEN) {
            return conditionRow.valueFrom;
        }

        return getLookupItem(data, conditionRow.valueFrom);
    }, [conditionRow, data]);

    const valueTo = conditionRow.valueTo;

    const maxInputValue = useMemo(() => {
        switch (pickedValue?.value) {
            case ConditionTypesEnum.AGE_YEARS:
                return MAX_AGE_YEARS;
            case ConditionTypesEnum.AGE_DAYS:
            default:
                return MAX_SAFE_INTEGER;
        }
    }, [pickedValue?.value]);

    useEffect(() => {
        setLookupValue(undefined);
    }, [pickedValue]);

    useEffect(() => {
        if (conditionOperator === ConditionOperator.EQUAL) {
            setLookupValue(valueFrom as Lookup<ID>);
        }
    }, [valueFrom, conditionOperator]);

    if (pickedValue && !pickedValue?.alias) {
        const isFromValueError =
            hasErrors &&
            isConditionValueHasError(
                conditionGroupErrors[conditionGroupIndex]?.conditions[conditionRowIndex] ?? null,
                "isValueFrom"
            );
        const isToValueError =
            hasErrors &&
            isConditionValueHasError(
                conditionGroupErrors[conditionGroupIndex]?.conditions[conditionRowIndex] ?? null,
                "isValueTo"
            );

        return (
            <div className="w-full col-span-6 flex gap-2">
                <MaskedNumberInput
                    placeholder="From"
                    type="text"
                    label={label}
                    onInput={onInputValueFromChange}
                    min={0}
                    max={maxInputValue}
                    mask={Number}
                    scale={0}
                    defaultValue={(valueFrom as number) || ""}
                    inputClassName={isFromValueError ? "border-red-100 border-2" : ""}
                />
                <div className="self-end">
                    <MaskedNumberInput
                        placeholder="To"
                        type="text"
                        label={label}
                        onInput={onInputValueToChange}
                        min={0}
                        max={maxInputValue}
                        mask={Number}
                        scale={0}
                        defaultValue={valueTo || ""}
                        inputClassName={isToValueError ? "border-red-100 border-2" : ""}
                    />
                </div>
            </div>
        );
    }

    const isSelectValueError =
        hasErrors &&
        isConditionValueHasError(
            conditionGroupErrors[conditionGroupIndex]?.conditions[conditionRowIndex] ?? null,
            "isValueFrom"
        );

    return (
        <div className="w-full col-span-6">
            <Select
                options={data}
                label={label}
                disabled={!pickedValue || isFetching}
                value={lookupValue}
                onChange={onSelectChange}
                className={isSelectValueError ? "has-error" : ""}
                defaultValue={valueFrom as Lookup<ID>}
            />
        </div>
    );
};

export default observer(ConditionRowValueControl);
