import { TemplatesTypesEnum } from "../../components/TreeView/models";
import { ExamTemplate } from "../../shared/models/business/exam";
import { CommonDictionaryItem } from "../../shared/models/dictionaries";
import { ButtonProps } from "../../components/uiKit/Button/models";
import { UrgencyStatus } from "../../shared/models/business/enums";

type CreateOrderExamTemplate = { uuid: string; urgency_id: UrgencyStatus };
type CreateOrderKitTemplate = { uuid: string; exam_templates: Array<CreateOrderExamTemplate> };

export interface CreateOrder {
    user_uuid: string;
    referral_notes: string;
    referral_doctor: string;
    kit_templates?: Array<CreateOrderKitTemplate>;
    exam_templates?: Array<CreateOrderExamTemplate>;
}

export type ExaminationListItemProps = {
    name: string;
    isChecked: boolean;
    onChange: (checked: boolean, uuid: string) => void;
    uuid: string;
    type: TemplatesTypesEnum;
};

export interface StepperSummaryProps {
    isDisabled: boolean;
    submitButton?: ButtonProps;
}

export type SelectedExaminationsListProps = { exams: Array<ExamTemplate> };

export interface OrderConditionResponse {
    id: number;
    name: string;
    operator: number;
    options: Array<CommonDictionaryItem>;
}

export interface OrderConditionBody {
    type_id: number;
    operator: number;
    value: number;
}

export const HiddenConditions = {
    SEX: 1,
    AGE_YEARS: 2,
    AGE_DAYS: 3,
} as const;

export const hiddenConditionsArray: Array<number> = Object.values(HiddenConditions);

export interface KitActivationData {
    user_uuid: string;
    kit_number: string;
    referral_doctor: string;
    referral_notes: string;
    order_conditions: Array<OrderConditionBody>;
}
