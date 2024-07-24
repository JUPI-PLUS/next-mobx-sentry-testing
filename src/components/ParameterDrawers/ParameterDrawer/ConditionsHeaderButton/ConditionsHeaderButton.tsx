// libs
import React from "react";
import { observer } from "mobx-react";
import { PlusIcon } from "@heroicons/react/20/solid";

// components
import { TextButton } from "../../../uiKit/Button/Button";
import { useParameterConditionsStore } from "../../components/ParameterConditions/store";
import { MAX_GROUP_COUNT } from "../../components/ParameterConditions/constants";

const ConditionsHeaderButton = () => {
    const {
        parameterConditionsStore: { addConditionGroup, conditionGroups },
    } = useParameterConditionsStore();

    const onAddGroup = () => {
        addConditionGroup();
    };

    return (
        <TextButton
            text="Add group"
            size="thin"
            variant="neutral"
            className="font-medium"
            disabled={conditionGroups.length >= MAX_GROUP_COUNT}
            onClick={onAddGroup}
            startIcon={<PlusIcon className="w-4 h-4" />}
        />
    );
};

export default observer(ConditionsHeaderButton);
