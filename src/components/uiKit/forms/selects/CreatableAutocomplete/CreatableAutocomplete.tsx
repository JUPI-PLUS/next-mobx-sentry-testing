//  libs
import React, { useId } from "react";
import AsyncSelect from "react-select/async-creatable";

//  helpers
import { getSelectIconClassName, getTheme } from "../utils";

//  models
import { CreatableAutocompleteProps } from "./models";

//  components
import SelectWrapper from "../components/SelectWrapper";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";
import FieldError from "../../FieldError/FieldError";

const CreatableAutocomplete = <Option,>({
    label,
    errorMessage,
    name,
    hint,
    formRef,
    ...rest
}: CreatableAutocompleteProps<Option>) => {
    const customId = useId();

    return (
        <SelectWrapper isError={Boolean(errorMessage)}>
            <>
                {label && (
                    <label
                        htmlFor={`react-select-${name ?? ""}${customId}-input`}
                        className="text-xs font-medium text-dark-800 peer-focus:text-dark-900 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <AsyncSelect<Option>
                    id={name}
                    instanceId={`${name ?? ""}${customId}`}
                    {...rest}
                    ref={formRef}
                    theme={getTheme}
                    classNamePrefix="react-select"
                    components={{
                        ClearIndicator: ({ clearValue, hasValue, isFocused }) => {
                            if (!hasValue) return <></>;
                            return (
                                <div className="p-2">
                                    <XMarkIcon
                                        className={`w-5 h-5 cursor-pointer ${getSelectIconClassName(
                                            hasValue,
                                            isFocused
                                        )}`}
                                        onClick={clearValue}
                                    />
                                </div>
                            );
                        },
                        DropdownIndicator: ({ isFocused, hasValue }) => {
                            return (
                                <div className="p-2">
                                    <ChevronDownIcon
                                        className={`w-5 h-5 ${getSelectIconClassName(hasValue, isFocused)}`}
                                    />
                                </div>
                            );
                        },
                    }}
                />
                {hint && !errorMessage && <span className="mt-1 text-xs text-dark-800">{hint}</span>}
                {errorMessage && <FieldError message={errorMessage} />}
            </>
        </SelectWrapper>
    );
};

export default CreatableAutocomplete;
