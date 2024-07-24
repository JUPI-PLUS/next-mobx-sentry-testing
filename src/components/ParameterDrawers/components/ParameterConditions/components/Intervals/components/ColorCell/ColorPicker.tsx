import React, { FC } from "react";
import CheckIcon from "../../../../../../../uiKit/Icons/CheckIcon";
import { ColorCircleProps, ColorPickerProps } from "./models";

const ColorCircle: FC<ColorCircleProps> = ({ isActive, color, onChange }) => {
    const commonColorClassName =
        "w-10 h-10 rounded-full cursor-pointer flex items-center justify-center border border-dark-400";
    const activeColorClassName = "ring-1 ring-dark-400 ring-offset-4";

    return (
        <li
            className={`${commonColorClassName} ${isActive ? activeColorClassName : ""}`}
            style={{ backgroundColor: `#${color}` }}
            onClick={onChange}
        >
            {isActive && <CheckIcon className="stroke-dark-900 w-4 h-4" />}
        </li>
    );
};

const ColorPicker: FC<ColorPickerProps> = ({ colors, selectedColorId, onColorChange }) => {
    return (
        <ul className="flex bg-white p-4 gap-4 border border-dark-400 rounded-md shadow-datepicker">
            {colors.map(({ label, value }) => (
                <ColorCircle
                    key={value}
                    color={label}
                    isActive={value === selectedColorId}
                    onChange={() => onColorChange(value)}
                />
            ))}
        </ul>
    );
};

export default ColorPicker;
