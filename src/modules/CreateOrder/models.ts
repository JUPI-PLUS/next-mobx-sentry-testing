import { TemplateTypeEnum } from "../../shared/models/business/template";
import { ExamTemplate } from "../../shared/models/business/exam";
import { CommonDictionaryItem } from "../../shared/models/dictionaries";
import { Lookup } from "../../shared/models/form";
import { ButtonProps } from "../../components/uiKit/Button/models";
import { ExamTemplateStatusesEnum, ExaminationTemplate } from "../../shared/models/business/examTemplate";
import { KitTemplate } from "../KitTemplate/components/KitForm/models";
import { UrgencyStatus } from "../../shared/models/business/enums";
import { SetUrgencyStatusEnum } from "./enums";
import { MouseEvent } from "react";
import { ID } from "../../shared/models/common";

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
    type: TemplateTypeEnum;
};

export interface StepperSummaryProps {
    isDisabled: boolean;
    submitButton?: ButtonProps;
}

export type TemplateItem = {
    uuid: string;
    name: string;
    urgencyStatus?: UrgencyStatus;
};

export type ExamTemplateItem = TemplateItem & {
    sample_types_name?: string;
    sample_types_id?: ID | null;
};

export type OnTemplateStatusChange = { kitUUID?: string; examUUID?: string; type?: SetUrgencyStatusEnum };

export type TemplatesAccordionsProps = {
    title?: string;
    isReadOnly?: boolean;
    kitTemplates: Array<TemplateItem>;
    examTemplates: Array<ExamTemplateItem> | undefined;
    getExamTemplatesByKitUUID: (uuid: string) => Array<ExamTemplateItem> | undefined;
    onStatusChange?: (args: OnTemplateStatusChange) => (event: MouseEvent, status: UrgencyStatus) => void;
    onAllStatusesChange?: (event: MouseEvent, status: UrgencyStatus) => void;
};

export interface OrderConditionResponse {
    id: number;
    name: string;
    operator: number;
    options: Array<CommonDictionaryItem>;
}

export interface PatchOrderConditionBody {
    type_id: number;
    operator: number;
    value: number;
}

export interface PatchOrderConditionsRequest {
    conditions: Array<PatchOrderConditionBody>;
    uuid: string;
}

export enum CreateOrderStepsEnum {
    EXAMINATIONS = 0,
    ADDITIONAL_INFO,
}

export type TemplatesFilters = {
    name: string;
    status: ExamTemplateStatusesEnum | null;
};

export const HiddenConditions = {
    SEX: 1,
    AGE_YEARS: 2,
    AGE_DAYS: 3,
} as const;

export const hiddenConditionsArray: Array<number> = Object.values(HiddenConditions);

export type SecondStepFormValuesType = Record<string, string | Lookup<string | number> | null>;

export type ExaminationTemplateWithUrgency = ExaminationTemplate & {
    urgencyStatus?: UrgencyStatus;
};

export type ExamTemplateWithUrgency = ExamTemplate & {
    urgencyStatus?: UrgencyStatus;
};

export type KitTemplateWithUrgency = KitTemplate & {
    urgencyStatus?: UrgencyStatus;
};

export const DEFAULT_ORDER_TEMPLATES_URGENCY_STATUS = UrgencyStatus.NORMAL;
