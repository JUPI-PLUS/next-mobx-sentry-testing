import React, { useId } from "react";
import { AutocompleteProps } from "./models";
import AsyncSelect from "react-select/async";
import FieldError from "../../FieldError/FieldError";
import { getTheme } from "../utils";
import SelectWrapper from "../components/SelectWrapper";

const Autocomplete = <Option,>({
    label,
    errorMessage,
    name,
    formRef,
    className,
    selectClassName,
    hint,
    ...rest
}: AutocompleteProps<Option>) => {
    const customId = useId();

    return (
        <SelectWrapper isError={Boolean(errorMessage)} className={className}>
            <>
                {label && (
                    <label
                        htmlFor={`react-select-${name ?? ""}${customId}-input`}
                        className="text-xs font-medium text-dark-800 peer-focus:text-dark-900 mb-1.5"
                    >
                        {label}
                    </label>
                )}
                <AsyncSelect
                    id={name}
                    instanceId={`${name ?? ""}${customId}`}
                    {...rest}
                    theme={getTheme}
                    ref={formRef}
                    classNamePrefix="react-select"
                    className={selectClassName}
                />
                {hint && !errorMessage && <span>{hint}</span>}
                {errorMessage && <FieldError message={errorMessage} />}
            </>
        </SelectWrapper>
    );
};

export default Autocomplete;
