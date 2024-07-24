import React, { useId } from "react";
import ReactSelect from "react-select";
import { MultiSelectProps } from "./models";
import { DisabledOption, MaybeDisabledOption } from "../Select/models";
import FieldError from "../../FieldError/FieldError";
import { getSelectClassName, getSelectIconClassName, getTheme } from "../utils";
import SelectWrapper from "../components/SelectWrapper";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/20/solid";

const MultiSelect = <Option extends MaybeDisabledOption>({
    options,
    label,
    name,
    disabled,
    onChange,
    errorMessage,
    value,
    defaultValue,
    placeholder,
    menuPosition = "fixed",
    isFilter = false,
    formRef,
    maxWidth = "100%",
    className = "",
    isScrollable = false,
    maxScrollableHeight = "90px",
    tabSelectsValue = false,
}: MultiSelectProps<Option>) => {
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
                <ReactSelect<Option, true>
                    aria-label={label?.toString() || placeholder}
                    aria-disabled={disabled}
                    isMulti
                    menuPosition={menuPosition}
                    instanceId={`${name ?? ""}${customId}`}
                    id={name}
                    name={name}
                    options={options}
                    onChange={onChange}
                    isDisabled={disabled}
                    value={value}
                    defaultValue={defaultValue}
                    tabSelectsValue={tabSelectsValue}
                    styles={{
                        control: base =>
                            isScrollable ? { ...base, overflowY: "auto", maxHeight: maxScrollableHeight } : base,
                        indicatorsContainer: base =>
                            isScrollable ? { ...base, alignSelf: "start", position: "sticky", top: 0 } : base,
                        menuPortal: base => ({ ...base, zIndex: 50 }),
                        menu: base => ({ ...base, width: "max-content", minWidth: "100%", maxWidth }),
                        option: base => ({ ...base, wordBreak: "break-word" }),
                    }}
                    isOptionDisabled={(option: DisabledOption<Option>) => option?.disabled ?? false}
                    theme={getTheme}
                    classNamePrefix="react-select"
                    className={selectClassName}
                    placeholder={placeholder}
                    ref={formRef}
                    components={{
                        ClearIndicator: ({ clearValue, hasValue, isFocused }) => {
                            if (!hasValue) return <></>;
                            return (
                                <div className="p-2">
                                    <XMarkIcon
                                        className={`w-5 h-5 cursor-pointer ${getSelectIconClassName(
                                            hasValue,
                                            isFocused,
                                            isFilter
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
                                        className={`w-5 h-5 ${getSelectIconClassName(hasValue, isFocused, isFilter)}`}
                                    />
                                </div>
                            );
                        },
                    }}
                />
                {errorMessage && <FieldError message={errorMessage} name={name} />}
            </>
        </SelectWrapper>
    );
};

export default MultiSelect;
