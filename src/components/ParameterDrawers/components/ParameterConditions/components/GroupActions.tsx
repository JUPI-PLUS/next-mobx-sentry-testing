// libs
import React, { FC, MouseEvent } from "react";
import { observer } from "mobx-react";

// components
import { IconButton } from "../../../../uiKit/Button/Button";
import MoveUpIcon from "../../../../uiKit/Icons/MoveUpIcon";
import MoveDownIcon from "../../../../uiKit/Icons/MoveDownIcon";
import CopyIcon from "../../../../uiKit/Icons/CopyIcon";
import DeleteIcon from "../../../../uiKit/Icons/DeleteIcon";

// store
import { useParameterConditionsStore } from "../store";

// helpers
import { showSuccessToast } from "../../../../uiKit/Toast/helpers";

// constants
import { MAX_GROUP_COUNT } from "../constants";

// models
import { GroupActionsProps } from "./models";

const GroupActions: FC<GroupActionsProps> = ({ isMoveUpDisabled, isMoveDownDisabled, groupIndex, groupId }) => {
    const {
        parameterConditionsStore: {
            deleteConditionGroup,
            moveConditionGroup,
            copyConditionGroup,
            setupMovedConditionGroupId,
            removeMovedConditionGroups,
            conditionGroups,
        },
    } = useParameterConditionsStore();

    const onDeleteGroup = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        deleteConditionGroup(groupId);
        showSuccessToast({ title: `Group ${groupIndex + 1} has been deleted` });
    };

    const onMoveUpGroup = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const nextIndex = groupIndex - 1;
        moveConditionGroup(groupId, groupIndex, nextIndex);
        removeMovedConditionGroups();
        setupMovedConditionGroupId(groupId);
    };

    const onMoveDownGroup = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        const nextIndex = groupIndex + 1;
        moveConditionGroup(groupId, groupIndex, nextIndex);
        removeMovedConditionGroups();
        setupMovedConditionGroupId(groupId);
    };

    const onCopyGroup = (event: MouseEvent) => {
        event.preventDefault();
        event.stopPropagation();
        copyConditionGroup(groupId);
        showSuccessToast({
            title: `Group ${groupIndex + 1} has been copied`,
            message: `Group ${groupIndex + 1} has been copied to bottom of the list`,
        });
    };

    const isCopyDisabled = conditionGroups.length >= MAX_GROUP_COUNT;

    return (
        <div className="flex gap-4 ml-auto z-30">
            <IconButton size="thin" variant="transparent" disabled={isMoveUpDisabled} onClick={onMoveUpGroup}>
                <MoveUpIcon className={`${isMoveUpDisabled ? "fill-dark-400" : "fill-dark-700"}`} />
            </IconButton>
            <IconButton size="thin" variant="transparent" disabled={isMoveDownDisabled} onClick={onMoveDownGroup}>
                <MoveDownIcon className={`${isMoveDownDisabled ? "fill-dark-400" : "fill-dark-700"}`} />
            </IconButton>
            <IconButton size="thin" variant="transparent" onClick={onCopyGroup} disabled={isCopyDisabled}>
                <CopyIcon className={isCopyDisabled ? "fill-dark-400" : "fill-dark-700"} />
            </IconButton>
            <IconButton size="thin" variant="transparent" onClick={onDeleteGroup}>
                <DeleteIcon className="fill-dark-700" />
            </IconButton>
        </div>
    );
};

export default observer(GroupActions);
