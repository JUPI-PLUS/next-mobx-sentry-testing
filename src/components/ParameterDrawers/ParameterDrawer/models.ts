import { SubmitParameterFormData } from "../AssingOrCreateParameter/models";
import { AxiosError } from "axios";
import { BaseFormServerValidation } from "../../../shared/models/axios";
import { ParameterViewTypeEnum } from "../../../shared/models/business/enums";
import { ServerParameterConditionGroups } from "../components/ParameterConditions/models";

export interface ParameterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (
        formData: SubmitParameterFormData | ServerParameterConditionGroups[],
        step: CreateParameterDrawerStepsEnum,
        valueType?: ParameterViewTypeEnum
    ) => Promise<void>;
    title?: string;
    defaultValues?: SubmitParameterFormData;
    error?: AxiosError<BaseFormServerValidation> | null;
    uuid?: string;
    isEdit?: boolean;
}

export enum CreateParameterDrawerStepsEnum {
    GENERAL_INFO,
    CONDITIONS,
}
