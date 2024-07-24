// libs
import React, { FC } from "react";

// store
import { ActionDialogType } from "../../../../../../store";

// models
import { ExamTemplateParamTypesEnum } from "../../../../models";
import { ExamTemplateParamActionsProps } from "./models";

// components
import PencilIcon from "../../../../../../../../components/uiKit/Icons/PencilIcon";
import DeleteIcon from "../../../../../../../../components/uiKit/Icons/DeleteIcon";
import CirclePlusIcon from "../../../../../../../../components/uiKit/Icons/CirclePlusIcon";

const ExamTemplateParamActions: FC<ExamTemplateParamActionsProps> = ({
    setSelectedItem,
    setActionType,
    type,
    shouldShowDeleteIcon = true,
    uuid,
}) => {
    const onAddParameter = () => {
        setSelectedItem();
        setActionType(ActionDialogType.ADD_PARAMETER);
    };

    const onEdit = () => {
        setSelectedItem();
        setActionType(
            type === ExamTemplateParamTypesEnum.GROUP ? ActionDialogType.EDIT_GROUP : ActionDialogType.EDIT_PARAMETER
        );
    };

    const onDelete = () => {
        setSelectedItem();
        setActionType(
            type === ExamTemplateParamTypesEnum.GROUP
                ? ActionDialogType.DELETE_GROUP
                : ActionDialogType.DELETE_PARAMETER
        );
    };

    return (
        <div
            className={`flex gap-3 invisible ${
                type === ExamTemplateParamTypesEnum.GROUP ? "group-hover/folder:visible" : "group-hover/param:visible"
            }`}
        >
            {type === ExamTemplateParamTypesEnum.GROUP && (
                <CirclePlusIcon
                    className="fill-dark-700 hover:fill-dark-900 cursor-pointer"
                    onClick={onAddParameter}
                    data-testid={`parameter-add-icon-${uuid}`}
                />
            )}
            <PencilIcon
                className="fill-dark-700 hover:fill-dark-900 cursor-pointer"
                onClick={onEdit}
                data-testid={`parameter-edit-icon-${uuid}`}
            />
            {shouldShowDeleteIcon && (
                <DeleteIcon
                    className="fill-dark-700 hover:fill-dark-900 cursor-pointer"
                    onClick={onDelete}
                    data-testid={`parameter-delete-icon-${uuid}`}
                />
            )}
        </div>
    );
};

export default ExamTemplateParamActions;
