// libs
import React, { ChangeEvent, ClipboardEvent, KeyboardEvent, useCallback, useEffect, useMemo, useState } from "react";

// helpers
import { generateIds, generateRefs, generateValues } from "./helpers";

// models
import { BaseVerificationInputProps } from "./models";

// constants
import { DEFAULT_VERIFICATION_INPUT_LENGTH, ONLY_ALPHANUMERIC_REGEX, ONLY_NUMBERS_REGEX } from "./constants";

const BaseVerificationInput = ({
    autoFocus = false,
    length = DEFAULT_VERIFICATION_INPUT_LENGTH,
    onChange = () => {},
    onCompleted = () => {},
    type = "number",
    value: defaultValue = "",
    isError = false,
    ...rest
}: BaseVerificationInputProps) => {
    /**
     * generate a new array, map through it
     * and replace with the value when possible
     */

    const [values, setValues] = useState(() => generateValues(defaultValue, length));
    const [valuesIndexes] = useState(() => generateIds(length));

    const inputsRefs = useMemo(() => generateRefs(length), [length]);

    const validate = (input: string) => {
        if (type === "number") {
            return new RegExp(ONLY_NUMBERS_REGEX).test(input);
        }

        if (type === "alphanumeric") {
            return new RegExp(ONLY_ALPHANUMERIC_REGEX).test(input);
        }

        return true;
    };

    const setValue = (value: string, index: number) => {
        const nextValues = [...values];
        nextValues[index] = value;

        setValues(nextValues);

        const stringifiedValues = nextValues.join("");
        onChange(stringifiedValues);

        const isCompleted = stringifiedValues.length === length;
        if (isCompleted) {
            onCompleted(stringifiedValues);
        }
    };

    const focusInput = useCallback(
        (index: number) => {
            const input = inputsRefs[index]?.current;

            if (input) {
                requestAnimationFrame(() => {
                    input.focus();
                });
            }
        },
        [inputsRefs]
    );

    const blurInput = (index: number) => {
        const input = inputsRefs[index]?.current;

        if (input) {
            requestAnimationFrame(() => {
                input.blur();
            });
        }
    };

    const onInputChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
        const eventValue = event.target.value;
        /**
         * ensure we only display 1 character in the input
         * by clearing the already setted value
         */
        const value = eventValue.replace(values[index], "");

        /**
         * if the value is not valid, don't go any further
         */
        if (!validate(value)) {
            return;
        }

        /**
         * otp code
         */
        if (value.length > 1) {
            setValues(generateValues(eventValue, length));

            const isCompleted = eventValue.length === length;

            if (isCompleted) {
                onCompleted(eventValue);
                blurInput(index);
                return;
            }

            return;
        }

        setValue(value, index);

        /**
         * if the input is the last of the list
         * blur it, otherwise focus the next one
         */
        if (index === length - 1) {
            blurInput(index);
            return;
        }

        focusInput(index + 1);
    };

    const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>, index: number) => {
        const eventKey = event.key;

        switch (eventKey) {
            case "Backspace":
            case "Delete":
                /**
                 * prevent trigger a change event
                 * `onInputChange` won't be called
                 */
                event.preventDefault();
                if (values[index]) {
                    setValue("", index);
                } else {
                    setValue("", index - 1);
                    focusInput(index - 1);
                }
                return;
            case "ArrowLeft":
                /**
                 * prevent trigger a change event
                 * `onInputChange` won't be called
                 */
                event.preventDefault();
                focusInput(index - 1);
                return;
            case "ArrowRight":
                /**
                 * prevent trigger a change event
                 * `onInputChange` won't be called
                 */
                event.preventDefault();
                focusInput(index + 1);
                return;
            default:
                return;
        }
    };

    const onInputPaste = (event: ClipboardEvent<HTMLInputElement>, index: number) => {
        event.preventDefault();
        const pastedValue = event.clipboardData.getData("text");
        const nextValues = pastedValue.slice(0, length);

        if (!validate(nextValues)) {
            return;
        }

        setValues(generateValues(nextValues, length));

        const isCompleted = nextValues.length === length;

        if (isCompleted) {
            onCompleted(nextValues);
            blurInput(index);
            return;
        }

        focusInput(nextValues.length);
    };

    /**
     * autoFocus
     */
    useEffect(() => {
        if (autoFocus) {
            focusInput(0);
        }
    }, [autoFocus, focusInput, inputsRefs]);

    /**
     * On Error
     */
    useEffect(() => {
        if (isError) {
            focusInput(0);
        }
    }, [isError, focusInput, inputsRefs]);

    return (
        <>
            {inputsRefs.map((ref, index) => (
                <input
                    autoComplete="one-time-code"
                    className={`w-10 h-10 border-inset rounded-md outline-none transition-all text-center
                            text-lg disabled:text-dark-700 disabled:bg-dark-100 disabled:border-dark-600 placeholder:text-dark-800 
                            ${
                                isError
                                    ? "outline-red-100 outline outline-2 outline-offset-0 border-transparent focus:border-transparent"
                                    : "border border-dark-600 focus:border-dark-900"
                            }`}
                    key={valuesIndexes[index]}
                    onChange={event => onInputChange(event, index)}
                    onKeyDown={event => onInputKeyDown(event, index)}
                    onPaste={event => onInputPaste(event, index)}
                    ref={ref}
                    value={values[index]}
                    {...rest}
                />
            ))}
        </>
    );
};

export default BaseVerificationInput;
