// libs
import React, { FC } from "react";

// helpers
import { showSuccessToast } from "../../../../../../../../components/uiKit/Toast/helpers";

// models
import { AddParameterDrawerProps } from "./models";
import { Parameter } from "../../../../../../../../shared/models/business/parameter";

// components
import AssignOrCreateParameterDrawer from "../../../../../../../../components/ParameterDrawers/AssingOrCreateParameter/AssignOrCreateParameterDrawer";

const AddParameterDrawer: FC<AddParameterDrawerProps> = ({ isOpen, onClose, onAddParameter, pickedParamsUUID }) => {
    const onSubmit = (formData: Parameter) => {
        onAddParameter(formData);
        showSuccessToast({ title: `Parameter ${formData.name} has been added` });
    };

    if (!isOpen) return null;

    return <AssignOrCreateParameterDrawer onClose={onClose} onSubmit={onSubmit} pickedParamsUUID={pickedParamsUUID} />;
};
export default AddParameterDrawer;
