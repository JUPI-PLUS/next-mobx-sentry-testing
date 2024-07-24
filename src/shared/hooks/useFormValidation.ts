import { BaseFormValidationProps } from "../models/form";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { handleServerFormValidation } from "../utils/form";

export const useFormValidation = ({ isError, errors }: BaseFormValidationProps) => {
    const { setError } = useFormContext();
    useEffect(() => {
        if (isError && errors) {
            const formattedErrors = handleServerFormValidation(errors);

            formattedErrors.map(({ field, message }) => setError(field, { message: message[0] }));
        }
    }, [isError, errors]);
};
