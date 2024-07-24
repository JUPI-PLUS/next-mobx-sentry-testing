import React, { ChangeEvent, FC, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { useParameterConditionsStore } from "../../../../store";
import { INTERVAL_VALUE_MAX_SAVE_INTEGER } from "../../../../constants";
import NativeMaskedNumberInput from "../../../../../../../uiKit/forms/Inputs/MaskedInputs/NativeMaskedNumberInput/NativeMaskedNumberInput";
import debounce from "lodash/debounce";
import { ToCellProps } from "./models";
import { COMMA_SEPARATOR } from "../../../../../../../../shared/constants/common";

const ToCell: FC<ToCellProps> = ({ conditionGroupIndex, rowIndex }) => {
    const {
        parameterConditionsStore: {
            conditionGroups,
            hasErrors,
            setupIntervalValue,
            resetValueValidation,
            setupDisabledIntervals,
            removeDisabledIntervals,
            recalculateNextValues,
            isIntervalHasErrors,
        },
    } = useParameterConditionsStore();
    const [inputValue, setInputValue] = useState(() => conditionGroups[conditionGroupIndex].values[rowIndex].to || "");
    const valueFrom = conditionGroups[conditionGroupIndex].values[rowIndex].from ?? 0;
    const valueTo = conditionGroups[conditionGroupIndex].values[rowIndex].to ?? 0;

    const onToValueChange = (value: number | null) => {
        setupIntervalValue("to", value, conditionGroupIndex, rowIndex);
        if (value !== null) {
            recalculateNextValues("to", value, conditionGroupIndex, rowIndex);
        }
    };

    const updateInputValue = () => {
        if (`${valueTo}` !== `${inputValue}`) {
            setInputValue(valueTo);
        }
    };

    useEffect(() => {
        updateInputValue();
    }, [valueFrom]);

    const debouncedInput = useMemo(() => debounce(onToValueChange, 350), []);
    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;

        const numericValue = Number(value);

        if (value?.length) {
            if (numericValue >= valueFrom) {
                removeDisabledIntervals(conditionGroupIndex);
                resetValueValidation(conditionGroupIndex, rowIndex, "isValueTo");
            } else {
                setupDisabledIntervals(conditionGroupIndex);
            }
        } else {
            setupDisabledIntervals(conditionGroupIndex);
        }

        setInputValue(value);
        debouncedInput(numericValue);
    };

    const hasError = hasErrors && isIntervalHasErrors(conditionGroupIndex, rowIndex, "isValueTo");
    const errorClassName = hasError ? "border-b border-red-100" : "";

    return (
        <div className="pr-2">
            <NativeMaskedNumberInput
                mask={Number}
                type="text"
                value={inputValue ? inputValue.toString() : undefined}
                overwrite={true}
                scale={4}
                signed={false}
                padFractionalZeros={false}
                normalizeZeros={true}
                radix="."
                mapToRadix={[COMMA_SEPARATOR]}
                min={0}
                max={INTERVAL_VALUE_MAX_SAVE_INTEGER}
                placeholder="Add value"
                className={`disabled:bg-white disabled:cursor-not-allowed max-w-full ${errorClassName}`}
                onChange={onChange}
            />
        </div>
    );
};

export default observer(ToCell);
