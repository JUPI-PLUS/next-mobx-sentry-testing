import { AxiosError } from "axios";
import { BaseFormServerValidation } from "../../shared/models/axios";

export interface SubmitCreateSampleTypeData {
    code: string;
    name: string;
}

export interface FormCreateSampleTypeInputsProps {
    error?: AxiosError<BaseFormServerValidation> | null;
    isLoading?: boolean;
}

export interface FormSampleTypeInputsProps {
    error?: AxiosError<BaseFormServerValidation> | null;
    isLoading?: boolean;
}
