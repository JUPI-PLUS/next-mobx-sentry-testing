import { Lookup } from "../../../../shared/models/form";
import { CommonServerValidationProps } from "../../../../shared/models/serverValidation";

export interface KitActivationContainerProps extends CommonServerValidationProps {
    isConditionsListFetching: boolean;
}

export type KitActivationFormData = Record<string, Lookup<number>> & {
    referral_doctor: string;
    referral_notes: string;
};
