// libs
import { FieldValues, ResolverResult } from "react-hook-form";
import { ValidationError } from "yup";
import isPlainObject from "lodash/isPlainObject";
import isEmpty from "lodash/isEmpty";

export const formValidateErrorHandler = <FormFields extends FieldValues>(
    errors: ValidationError
): ResolverResult<FormFields> => {
    const customizeError = errors?.inner?.reduce(
        (allErrors: Partial<ValidationError>, currentError: ValidationError) => ({
            ...allErrors,
            [currentError.path as string]: {
                type: currentError.type ?? "validation",
                message: currentError.message,
            },
        }),
        {}
    );
    return {
        values: {},
        errors: customizeError,
    } as ResolverResult<FormFields>;
};

export const areDirtyFieldsEmpty = (object: Record<string, unknown>): unknown => {
    if (!isPlainObject(object)) return true;
    return Object.values(object).every(item => {
        if (Array.isArray(item)) return !Boolean(item.filter(Boolean).length);
        if (isPlainObject(item) && !isEmpty(item)) return false;
        if (typeof item === "boolean") return false;
        return isEmpty(item);
    });
};
