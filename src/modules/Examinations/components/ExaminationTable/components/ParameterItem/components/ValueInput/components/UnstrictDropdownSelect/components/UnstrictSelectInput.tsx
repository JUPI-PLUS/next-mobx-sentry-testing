// libs
import React, { ChangeEvent, useEffect, useState } from "react";
import { components, InputProps } from "react-select";
import { SingleValue } from "react-select";

// models
import { MaybeDisabledOption } from "../../../../../../../../../../../components/uiKit/forms/selects/Select/models";

const UnstrictSelectInput = <Option extends MaybeDisabledOption>(props: InputProps<Option, false>) => {
    const { selectProps } = props;
    const selectValue = selectProps.value as SingleValue<Option>;
    const selectLabel = selectValue?.label ?? "";
    const [inputValue, setInputValue] = useState(selectLabel);

    useEffect(() => {
        setInputValue(selectLabel);
    }, [selectLabel]);

    const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    return (
        <components.Input
            {...props}
            value={inputValue}
            onInput={onInputChange}
            style={{ gridArea: `1 / ${inputValue ? "2" : "3"} / auto / auto`, visibility: "visible" }}
            inputClassName="w-full outline-0 font-medium text-md text-dark-900 disabled:text-dark-700"
            placeholder="Select or type value"
        />
    );
};

export default UnstrictSelectInput;
