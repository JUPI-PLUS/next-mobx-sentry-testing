import React, { FC, useMemo } from "react";
import { ButtonGroupProps } from "./models";
import { renderGroupButtons } from "./utils";

const ButtonGroup: FC<ButtonGroupProps> = ({ size, variant, orientation = "vertical", className = "", children }) => {
    const orientationClassName = useMemo(() => {
        switch (orientation) {
            case "vertical":
                return "flex-col";
            default:
                return "flex-row";
        }
    }, [orientation]);

    const additionalProps = useMemo(
        () => ({
            size,
            variant,
        }),
        [size, variant]
    );

    return (
        <div className={`flex ${orientationClassName} ${className}`} aria-label="Button group">
            {renderGroupButtons(children, orientation, additionalProps)}
        </div>
    );
};

export default ButtonGroup;
