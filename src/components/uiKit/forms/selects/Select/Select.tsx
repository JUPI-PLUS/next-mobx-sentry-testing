import React, { useId } from "react";
import ReactSelect from "react-select";
import { DisabledOption, MaybeDisabledOption, SelectProps } from "./models";
import FieldError from "../../FieldError/FieldError";
import { getSelectClassName, getSelectIconClassName, getTheme } from "../utils";
import SelectWrapper from "../components/SelectWrapper";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";

const Select = <Option extends MaybeDisabledOption>({
    label,
    name,
    options,
    disabled,
    onChange,
    value,
    defaultValue,
    errorMessage,
    menuPlacement,
    menuPosition = "fixed",
    className = "",
    placeholder,
    clearable = false,
    isFilter = false,
    formRef,
    maxWidth,
    tabSelectsValue = false,
    autoFocus = false,
    isLoading = false,
}: SelectProps<Option>) => {
    const selectClassName = getSelectClassName(value, isFilter);
    const customId = useId();

    return (
        <SelectWrapper className={className} isError={Boolean(errorMessage)}>
            <>
                {label && (
                    <label
                        htmlFor={`react-select-${name ?? ""}${customId}-input`}
                        className="mb-1.5 break-words text-xs font-medium text-dark-800"
                    >
                        {label}
                    </label>
                )}
                <ReactSelect<Option>
                    aria-label={label?.toString() || placeholder}
                    aria-disabled={disabled}
                    menuPosition={menuPosition}
                    menuPlacement={menuPlacement}
                    instanceId={`${name ?? ""}${customId}`}
                    id={name}
                    name={name}
                    options={options}
                    onChange={onChange}
                    isDisabled={disabled}
                    isOptionDisabled={(option: DisabledOption<Option>) => option?.disabled ?? false}
                    value={value || null}
                    defaultValue={defaultValue}
                    data-testid={`select-${name}`}
                    classNamePrefix="react-select"
                    className={selectClassName}
                    isClearable={clearable}
                    tabSelectsValue={tabSelectsValue}
                    theme={getTheme}
                    placeholder={placeholder}
                    ref={formRef}
                    autoFocus={autoFocus}
                    isLoading={isLoading}
                    styles={{
                        indicatorSeparator: defaultProps => ({
                            ...defaultProps,
                            display: clearable ? "" : "none",
                        }),
                        menuPortal: base => ({ ...base, zIndex: 50 }),
                        menu: base => ({
                            ...base,
                            width: "max-content",
                            minWidth: "100%",
                            maxWidth: maxWidth || base.maxWidth,
                        }),
                        option: base => ({ ...base, wordBreak: "break-word" }),
                    }}
                    components={{
                        ClearIndicator: ({ clearValue, hasValue, isFocused }) => {
                            if (!hasValue) return <></>;
                            return (
                                <div className="p-2" onClick={clearValue} data-testid={`clear-value-${name}`}>
                                    <XMarkIcon
                                        className={`w-5 h-5 cursor-pointer ${getSelectIconClassName(
                                            hasValue,
                                            isFocused,
                                            isFilter
                                        )}`}
                                    />
                                </div>
                            );
                        },
                        DropdownIndicator: ({ isFocused, hasValue }) => {
                            return (
                                <div className="p-2 mr-1">
                                    <ChevronDownIcon
                                        className={`w-5 h-5 ${getSelectIconClassName(hasValue, isFocused, isFilter)}`}
                                    />
                                </div>
                            );
                        },
                    }}
                />
                {errorMessage && <FieldError message={errorMessage} />}
            </>
        </SelectWrapper>
    );
};

export default Select;
