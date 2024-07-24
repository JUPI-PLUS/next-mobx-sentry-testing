import Radio from "../../../../../../../uiKit/forms/Radio/Radio";
import React, { MouseEvent, FC } from "react";
import { observer } from "mobx-react";
import { useParameterConditionsStore } from "../../../../store";
import { NormCellProps } from "./models";

const NormCell: FC<NormCellProps> = ({ conditionGroupIndex, rowIndex }) => {
    const {
        parameterConditionsStore: { conditionGroups, setupIntervalNormalValue },
    } = useParameterConditionsStore();

    const isNormInterval = conditionGroups[conditionGroupIndex].values[rowIndex].isNormal;

    const onIsNormalChange = (event: MouseEvent<HTMLInputElement>) => {
        const isChecked = event.currentTarget.checked;
        if (isChecked && isNormInterval) return;
        setupIntervalNormalValue(isChecked, conditionGroupIndex, rowIndex);
    };

    const radioButtonValue = `${conditionGroupIndex}.${rowIndex}`;

    return (
        <div className="flex items-center pl-0.5 py-2">
            <Radio checked={isNormInterval} value={radioButtonValue} onChange={() => {}} onClick={onIsNormalChange} />
        </div>
    );
};

export default observer(NormCell);
