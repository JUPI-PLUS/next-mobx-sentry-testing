import React, { FC, useEffect, useRef } from "react";
import { IndeterminateCheckboxProps, IndeterminateCheckboxValues } from "./models";
import Checkbox from "./Checkbox";

const IndeterminateCheckbox: FC<IndeterminateCheckboxProps> = ({ value, ...rest }) => {
    const checkboxRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!checkboxRef.current) return;
        switch (value) {
            case IndeterminateCheckboxValues.Indeterminate:
                checkboxRef.current.indeterminate = true;
                checkboxRef.current.checked = false;
                break;
            case IndeterminateCheckboxValues.Checked:
                checkboxRef.current.indeterminate = false;
                checkboxRef.current.checked = true;
                break;
            case IndeterminateCheckboxValues.Empty:
            default:
                checkboxRef.current.indeterminate = false;
                checkboxRef.current.checked = false;
                break;
        }
    }, [value]);

    return <Checkbox ref={checkboxRef} value={value} {...rest} />;
};

export default IndeterminateCheckbox;
