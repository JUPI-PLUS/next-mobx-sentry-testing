// libs
import React, { useMemo } from "react";

// models
import { TextCellProps } from "./models";

// components
import { Tooltip } from "../../../uiKit/Tooltip/Tooltip";

const TextCell = ({ text, popperSize, textSize }: TextCellProps) => {
    const popperSizeClassName = useMemo(() => {
        switch (popperSize) {
            case "sm":
                return "max-w-sm";
            case "md":
                return "max-w-md";
            case "lg":
                return "max-w-lg";
            default:
                return "max-w-xs";
        }
    }, [popperSize]);

    const textSizeClassName = useMemo(() => {
        switch (textSize) {
            case "xs":
                return "max-w-xs";
            case "md":
                return "max-w-md";
            case "lg":
                return "max-w-lg";
            default:
                return "max-w-sm";
        }
    }, [textSize]);

    return (
        <Tooltip
            text={text}
            placement="bottom-start"
            offsetDistance={15}
            className="!block w-full"
            popperClassName={`arrow-placement-auto ${popperSizeClassName}`}
        >
            <p className={`${textSizeClassName} truncate`} aria-label={text}>
                {text}
            </p>
        </Tooltip>
    );
};

export default TextCell;
