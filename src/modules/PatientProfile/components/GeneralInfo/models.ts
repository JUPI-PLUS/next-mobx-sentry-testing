import { Lookup } from "../../../../shared/models/form";
import { Sex } from "../../../../shared/models/business/user";
import { CommonServerValidationProps } from "../../../../shared/models/serverValidation";

export interface GeneralInfoFormFields {
    first_name: string;
    last_name: string;
    sex: Lookup<Sex> | null;
    birth_date: { from: Date };
    email: string;
    isMakeAStaff?: boolean;
    citizenship: undefined;
    contingent: undefined;
    electronic_health_card: undefined;
    middle_name: undefined;
    notes: undefined;
    preferred_language: undefined;
}

export interface EditGeneralInfoFormPost {
    first_name: string;
    last_name: string;
    birth_date: number;
    sex_id: Sex;
    organization_id?: number | null;
    position_id?: number | null;
}

export type GeneralInfoFooterProps = {
    isSaveButtonDisable: boolean;
};

export type GeneralInfoContainerProps = {
    id: string;
};

export interface GeneralInfoFormProps extends CommonServerValidationProps {
    id: string;
    defaultValues: GeneralInfoFormFields;
}

export type FormWithValidationProps = CommonServerValidationProps;
