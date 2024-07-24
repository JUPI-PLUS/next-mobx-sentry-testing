// libs
import React, { FC, useMemo } from "react";
import { observer } from "mobx-react";

// components
import Select from "../../../../../../../uiKit/forms/selects/Select/Select";
import { IconButton } from "../../../../../../../uiKit/Button/Button";
import DeleteIcon from "../../../../../../../uiKit/Icons/DeleteIcon";
import Input from "../../../../../../../uiKit/forms/Inputs/CommonInput/Input";
import ConditionRowValueControl from "./components/ConditionRowValueControl";

// store
import { useParameterConditionsStore } from "../../../../store";

// models
import { SingleValue } from "react-select/dist/declarations/src/types";
import { Lookup } from "../../../../../../../../shared/models/form";
import { ConditionOperator, ParameterConditionTypeDictionaryItemLookup } from "../../../../models";
import { ConditionRowProps } from "./models";

// helpers
import { getLookupItem } from "../../../../../../../../shared/utils/lookups";
import { isConditionTypeHasError } from "../../../../utils";

const ConditionRow: FC<ConditionRowProps> = ({
    id,
    isOne,
    isFirst,
    isDefault,
    onDelete,
    conditionGroupIndex,
    rowIndex,
}) => {
    const {
        parameterConditionsStore: {
            conditionGroups,
            conditionGroupErrors,
            conditionTypesLookup,
            hasErrors,
            setupConditionType,
            resetConditionValidation,
        },
    } = useParameterConditionsStore();
    const conditionTypeLabel = isFirst ? "Referral conditions" : undefined;
    const conditionValueFromLabel = isFirst ? "Condition value" : undefined;
    const operatorLabel = isFirst ? "Operator" : undefined;
    const shouldShowDeleteButton = !isOne && !isDefault;
    const conditionType =
        getLookupItem<ParameterConditionTypeDictionaryItemLookup>(
            conditionTypesLookup,
            conditionGroups[conditionGroupIndex].conditions[rowIndex].typeId || null
        ) || undefined;
    const conditions = conditionGroups[conditionGroupIndex].conditions;
    const availableConditionTypes = conditionTypesLookup.filter(
        ({ value }) => !conditions.find(({ typeId }) => typeId === value)
    );

    const operatorValue = useMemo(() => {
        if (!conditionType) return "";
        return conditionType?.alias ? "Equal" : "Between";
    }, [conditionType]);

    const onDeleteClick = () => {
        onDelete(id);
    };

    const onConditionTypeChange = (option: SingleValue<Lookup<number> & { alias: string | null }>) => {
        const hasAlias = Boolean(option?.alias);
        setupConditionType(option?.value ?? undefined, hasAlias, conditionGroupIndex, rowIndex);
        resetConditionValidation(
            conditionGroupIndex,
            rowIndex,
            hasAlias ? ConditionOperator.EQUAL : ConditionOperator.BETWEEN,
            "isType"
        );
    };

    const isTypeError = hasErrors && isConditionTypeHasError(conditionGroupErrors[conditionGroupIndex], rowIndex);

    return (
        <div className="grid grid-cols-constructor justify-between mb-2">
            <Select
                options={availableConditionTypes}
                label={conditionTypeLabel}
                className={`col-span-3 pr-2 ${isTypeError ? "has-error" : ""}`}
                value={conditionType}
                onChange={onConditionTypeChange}
            />
            <div className="col-span-3 pr-2">
                <Input disabled label={operatorLabel} value={operatorValue} />
            </div>
            <ConditionRowValueControl
                label={conditionValueFromLabel}
                pickedValue={conditionType}
                conditionGroupIndex={conditionGroupIndex}
                conditionRowIndex={rowIndex}
            />
            {shouldShowDeleteButton && (
                <IconButton
                    size="thin"
                    variant="transparent"
                    className="self-end mb-2 justify-self-center ml-2"
                    onClick={onDeleteClick}
                >
                    <DeleteIcon className="fill-dark-700" />
                </IconButton>
            )}
        </div>
    );
};

export default observer(ConditionRow);
