import React, { FC, useEffect, useMemo, useState } from "react";
import Input from "../forms/Inputs/CommonInput/Input";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { SearchFiledProps } from "./models";
import debounce from "lodash/debounce";

const SearchField: FC<SearchFiledProps> = ({ onChange, onReset, value, ...rest }) => {
    const [inputValue, setInputValue] = useState(value);
    const debouncedChangeHandler = useMemo(() => debounce(onChange, 450), [onChange]);

    const onInputChange = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(target.value);
        debouncedChangeHandler(target.value);
    };

    const onClearInput = () => {
        debouncedChangeHandler.cancel();
        setInputValue("");
        onReset();
    };

    useEffect(() => {
        setInputValue(value);
    }, [value]);

    const hasValue = Boolean(inputValue?.length);

    return (
        <Input
            value={inputValue}
            endIcon={
                inputValue ? (
                    <XMarkIcon
                        data-testid="reset-icon"
                        className={`w-5 h-5 cursor-pointer ${hasValue && "fill-dark-900"}`}
                        onClick={onClearInput}
                    />
                ) : (
                    <MagnifyingGlassIcon data-testid="search-icon" className="w-5 h-5 cursor-pointer" />
                )
            }
            onChange={onInputChange}
            {...rest}
        />
    );
};

export default SearchField;
