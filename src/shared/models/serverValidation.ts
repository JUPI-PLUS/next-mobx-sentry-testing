import { AxiosError } from "axios";
import { BaseFormServerValidation } from "./axios";

export interface CommonServerValidationProps {
    isError?: boolean;
    errors: AxiosError<BaseFormServerValidation> | null;
}
