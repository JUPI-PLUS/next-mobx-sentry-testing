// libs
import React, { FC, useMemo } from "react";
import { observer } from "mobx-react";
import isUndefined from "lodash/isUndefined";
import { PlusIcon } from "@heroicons/react/20/solid";

// components
import ConditionRow from "./components/ConditionRow/ConditionRow";
import { TextButton } from "../../../../../uiKit/Button/Button";

// helpers
import { isValueReal } from "../../../../../../shared/utils/common";

// store
import { useParameterConditionsStore } from "../../store";

// constants
import { MAX_CONDITIONS_COUNT } from "../../constants";

// models
import { ConditionsProps } from "./models";
import { ConditionOperator } from "../../models";

const Conditions: FC<ConditionsProps> = ({ isDefault, index: conditionGroupIndex }) => {
    const {
        parameterConditionsStore: { conditionGroups, addConditionRow, deleteConditionRow },
    } = useParameterConditionsStore();

    const onAddConditionClick = () => {
        addConditionRow(conditionGroupIndex);
    };

    const onRowDelete = (rowId: string) => {
        deleteConditionRow(rowId, conditionGroupIndex);
    };

    const conditionRows = conditionGroups[conditionGroupIndex].conditions;
    const isAllowedToAddCondition = conditionRows.length < MAX_CONDITIONS_COUNT;
    const lastCondition = conditionRows.at(-1);
    const isAddConditionDisabled = useMemo(() => {
        if (isUndefined(lastCondition?.typeId)) {
            return true;
        }

        if (lastCondition?.operator === ConditionOperator.EQUAL && !isValueReal(lastCondition.valueFrom)) {
            return true;
        }

        return (
            lastCondition?.operator === ConditionOperator.BETWEEN &&
            (!isValueReal(lastCondition.valueFrom) || !isValueReal(lastCondition.valueTo))
        );
    }, [lastCondition?.typeId, lastCondition?.operator, lastCondition?.valueFrom, lastCondition?.valueTo]);

    return (
        <>
            {conditionGroups[conditionGroupIndex].conditions.map(({ id }, index) => {
                return (
                    <ConditionRow
                        key={id}
                        id={id}
                        isFirst={index === 0}
                        isOne={conditionRows.length === 1}
                        isDefault={isDefault}
                        onDelete={onRowDelete}
                        rowIndex={index}
                        conditionGroupIndex={conditionGroupIndex}
                    />
                );
            })}
            {isAllowedToAddCondition && (
                <TextButton
                    text="Add condition"
                    size="thin"
                    variant="transparent"
                    type="button"
                    className="text-brand-100 font-medium disabled:text-dark-400"
                    disabled={isAddConditionDisabled}
                    startIcon={<PlusIcon className="w-6 h-6" />}
                    onClick={onAddConditionClick}
                />
            )}
        </>
    );
};

export default observer(Conditions);
