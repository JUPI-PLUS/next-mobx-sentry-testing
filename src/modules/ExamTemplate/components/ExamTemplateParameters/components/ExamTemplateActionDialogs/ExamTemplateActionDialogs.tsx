// libs
import React, { FC } from "react";
import { observer } from "mobx-react";

// store
import { useExamTemplateStore } from "../../../../store";

// components
import DeleteDialog from "./components/DeleteDialog/DeleteDialog";
import GroupDialog from "./components/GroupDialog/GroupDialog";
import AddParameterDrawer from "./components/AddParameterDrawer/AddParameterDrawer";
import EditParameterDrawer from "./components/EditParameterDrawer/EditParameterDrawer";

const ExamTemplateActionDialogs: FC = () => {
    const {
        examTemplateStore: {
            dialogTitle,
            clearActionType,
            addGroup,
            editGroup,
            addParameter,
            editParameter,
            selectedItem,
            selectedGroup,
            deleteGroup,
            deleteParameter,
            isAddEditGroupDialogOpen,
            isAddParameterDrawerOpen,
            isEditParameterDrawerOpen,
            isDeleteDialogOpen,
            examTemplateUUID,
            examTemplateParamsUUIDFromMap,
        },
    } = useExamTemplateStore();

    return (
        <>
            <GroupDialog
                isOpen={isAddEditGroupDialogOpen}
                onClose={clearActionType}
                dialogTitle={dialogTitle}
                selectedGroup={selectedGroup}
                onAddGroup={addGroup}
                onEditGroup={editGroup}
                examTemplateUUID={examTemplateUUID}
            />
            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onClose={clearActionType}
                dialogTitle={dialogTitle}
                selectedGroup={selectedGroup}
                selectedParameterName={selectedItem.item?.name}
                onDeleteGroup={deleteGroup}
                onDeleteParameter={deleteParameter}
                examTemplateUUID={examTemplateUUID}
            />
            {isAddParameterDrawerOpen && (
                <AddParameterDrawer
                    isOpen
                    onClose={clearActionType}
                    onAddParameter={addParameter}
                    pickedParamsUUID={examTemplateParamsUUIDFromMap}
                />
            )}
            {isEditParameterDrawerOpen && (
                <EditParameterDrawer
                    isOpen
                    onClose={clearActionType}
                    onEditParameter={editParameter}
                    paramUUID={selectedItem.item?.uuid}
                />
            )}
        </>
    );
};

export default observer(ExamTemplateActionDialogs);
