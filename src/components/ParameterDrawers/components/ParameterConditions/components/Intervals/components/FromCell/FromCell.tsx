import React, { ChangeEvent, FC, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { useParameterConditionsStore } from "../../../../store";
import NativeMaskedNumberInput from "../../../../../../../uiKit/forms/Inputs/MaskedInputs/NativeMaskedNumberInput/NativeMaskedNumberInput";
import { INTERVAL_VALUE_MAX_SAVE_INTEGER } from "../../../../constants";
import debounce from "lodash/debounce";
import isNumber from "lodash/isNumber";
import { FromCellProps } from "./models";
import { COMMA_SEPARATOR } from "../../../../../../../../shared/constants/common";

const FromCell: FC<FromCellProps> = ({ conditionGroupIndex, rowIndex }) => {
    const {
        parameterConditionsStore: {
            conditionGroups,
            hasErrors,
            isIntervalHasErrors,
            setupIntervalValue,
            setupDisabledIntervals,
            removeDisabledIntervals,
            resetValueValidation,
            recalculateNextValues,
        },
    } = useParameterConditionsStore();
    const [inputValue, setInputValue] = useState(() =>
        isNumber(conditionGroups[conditionGroupIndex].values[rowIndex].from)
            ? conditionGroups[conditionGroupIndex].values[rowIndex].from
            : ""
    );

    const onValueFromChange = (value: number | null) => {
        setupIntervalValue("from", value, conditionGroupIndex, rowIndex);
        if (value !== null) {
            recalculateNextValues("from", value, conditionGroupIndex, rowIndex);
        }
    };

    const debouncedInput = useMemo(() => debounce(onValueFromChange, 350), []);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        if (value === "") {
            setupDisabledIntervals(conditionGroupIndex);
        } else {
            removeDisabledIntervals(conditionGroupIndex);
            resetValueValidation(conditionGroupIndex, rowIndex, "isValueFrom");
        }
        setInputValue(value);
        debouncedInput(value ? Number(value) : null);
    };

    if (rowIndex > 0) {
        return <div>{conditionGroups[conditionGroupIndex].values[rowIndex].from}</div>;
    }

    const hasError = hasErrors && isIntervalHasErrors(conditionGroupIndex, rowIndex, "isValueFrom");
    const errorClassName = hasError ? "border-b border-red-100" : "";

    return (
        <div className="pr-2">
            <NativeMaskedNumberInput
                mask={Number}
                type="text"
                value={String(inputValue)}
                overwrite={true}
                scale={4}
                signed={false}
                padFractionalZeros={false}
                normalizeZeros={true}
                radix="."
                mapToRadix={[COMMA_SEPARATOR]}
                min={0}
                max={INTERVAL_VALUE_MAX_SAVE_INTEGER}
                disabled={rowIndex > 0}
                placeholder="Add value"
                className={`disabled:bg-white disabled:cursor-not-allowed max-w-full ${errorClassName}`}
                onChange={onChange}
            />
        </div>
    );
};

export default observer(FromCell);
