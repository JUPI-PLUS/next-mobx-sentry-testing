import { Dispatch, SetStateAction } from "react";
import { ID } from "../../../../shared/models/common";
import { AxiosError } from "axios";
import { BaseFormServerValidation } from "../../../../shared/models/axios";

export interface Option {
    id: number;
    value: ID;
    label: string;
}

export interface OptionsContainerProps {
    items: Option[];
    setItems: Dispatch<SetStateAction<Option[]>>;
    isDisabled?: boolean;
}

export interface SubmitParameterStepProps {
    options?: Option[] | null;
    isDisabled?: boolean;
    uuid?: string;
    onFetchingChange?: (isFetching: boolean) => void;
    error?: AxiosError<BaseFormServerValidation> | null;
}
