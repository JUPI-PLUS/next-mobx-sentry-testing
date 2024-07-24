import React, { useId } from "react";
import ReactSelect from "react-select/creatable";
import { MultiSelectProps } from "./models";
import { DisabledOption, MaybeDisabledOption } from "../Select/models";
import FieldError from "../../FieldError/FieldError";
import { getTheme } from "../utils";
import SelectWrapper from "../components/SelectWrapper";

const CreatableMultiSelect = <Option extends MaybeDisabledOption>({
    options,
    label,
    name,
    disabled,
    onChange,
    errorMessage,
    value,
    defaultValue,
    formRef,
}: MultiSelectProps<Option>) => {
    const customId = useId();

    return (
        <SelectWrapper isError={Boolean(errorMessage)}>
            <>
                {label && (
                    <label htmlFor={`react-select-${name ?? ""}${customId}-input`} className="break-words">
                        {label}
                    </label>
                )}
                <ReactSelect<Option, true>
                    aria-label={label?.toString()}
                    aria-disabled={disabled}
                    isMulti
                    instanceId={`${name ?? ""}${customId}`}
                    id={name}
                    name={name}
                    options={options}
                    onChange={onChange}
                    isDisabled={disabled}
                    value={value}
                    defaultValue={defaultValue}
                    isOptionDisabled={(option: DisabledOption<Option>) => option?.disabled ?? false}
                    theme={getTheme}
                    classNamePrefix="react-select"
                    ref={formRef}
                />
                {errorMessage && <FieldError message={errorMessage} name={name} />}
            </>
        </SelectWrapper>
    );
};

export default CreatableMultiSelect;
