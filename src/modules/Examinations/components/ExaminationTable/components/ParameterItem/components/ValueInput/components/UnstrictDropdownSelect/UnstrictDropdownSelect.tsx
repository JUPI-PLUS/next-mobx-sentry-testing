// libs
import React, { useState } from "react";
import ReactSelect from "react-select/creatable";
import { ActionMeta, InputActionMeta, SingleValue } from "react-select";

// helpers
import { getTheme } from "../../../../../../../../../../components/uiKit/forms/selects/utils";

// models
import {
    DisabledOption,
    MaybeDisabledOption,
} from "../../../../../../../../../../components/uiKit/forms/selects/Select/models";
import { UnstrictDropdownSelectProps } from "./models";

// components
import SelectWrapper from "../../../../../../../../../../components/uiKit/forms/selects/components/SelectWrapper";
import FieldError from "../../../../../../../../../../components/uiKit/forms/FieldError/FieldError";
import UnstrictSelectInput from "./components/UnstrictSelectInput";
import { SelectSingleValue } from "./components/UnstrictSingleValue";

const UnstrictDropdownSelect = <Option extends MaybeDisabledOption>({
    options,
    name,
    disabled,
    onChange,
    errorMessage,
    value,
    formRef,
}: UnstrictDropdownSelectProps<Option>) => {
    const [inputValue, setInputValue] = useState(value?.label ?? "");
    const [pickedOptionLabel, setPickedOptionLabel] = useState(value?.label ?? "");

    const onSelectChange = (newValue: SingleValue<Option>, actionMeta: ActionMeta<Option>) => {
        setPickedOptionLabel(newValue?.label ?? "");
        setInputValue(newValue?.label ?? "");
        onChange?.(newValue, actionMeta);
    };

    const onSelectFocus = () => {
        setInputValue(pickedOptionLabel);
    };

    const onInputChange = (eventValue: string, actionMeta: InputActionMeta) => {
        if (actionMeta.action === "input-change") {
            setInputValue(eventValue);
        }
    };

    return (
        <SelectWrapper isError={Boolean(errorMessage)}>
            <>
                <ReactSelect<Option>
                    instanceId={name}
                    id={name}
                    name={name}
                    options={options}
                    isDisabled={disabled}
                    onChange={onSelectChange}
                    defaultValue={value}
                    isOptionDisabled={(option: DisabledOption<Option>) => option?.disabled ?? false}
                    theme={getTheme}
                    classNamePrefix="react-select"
                    ref={formRef}
                    value={value}
                    inputValue={inputValue}
                    onInputChange={onInputChange}
                    components={{
                        SingleValue: SelectSingleValue,
                        Input: UnstrictSelectInput,
                    }}
                    onFocus={onSelectFocus}
                    formatCreateLabel={typedValue => `Use: ${typedValue}`}
                />
                {errorMessage && <FieldError message={errorMessage} name={name} />}
            </>
        </SelectWrapper>
    );
};

export default UnstrictDropdownSelect;
