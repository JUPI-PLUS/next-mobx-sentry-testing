// libs
import React, { FC } from "react";

// models
import { ParametersButtonsProps } from "./models";

// components
import { OutlineButton } from "../../../../../../components/uiKit/Button/Button";

const ParametersButtons: FC<ParametersButtonsProps> = ({ onAddParameter, onAddGroup, containerClass = "" }) => {
    return (
        <div className={`flex items-center gap-4 ${containerClass}`}>
            <OutlineButton
                type="submit"
                size="sm"
                data-testid="add-parameter-button"
                text="Add parameter"
                onClick={onAddParameter}
                className="w-full justify-center"
            />
            <OutlineButton
                type="submit"
                size="sm"
                data-testid="add-parameters-group-button"
                text="Add group of parameters"
                onClick={onAddGroup}
                className="w-full justify-center"
            />
        </div>
    );
};

export default ParametersButtons;
