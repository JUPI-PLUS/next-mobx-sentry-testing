import { ID } from "./common";

export interface CommonDictionaryItem {
    id: ID;
    name: string;
}

export type OrderStatusDictionaryItem = CommonDictionaryItem;
export type ExamStatusDictionaryItem = CommonDictionaryItem;
export type KitTemplateStatusDictionaryItem = CommonDictionaryItem;
export type ExamTemplateStatusDictionaryItem = CommonDictionaryItem;
export type ExamTemplatesDictionaryItem = CommonDictionaryItem;
export type GeneralStatusDictionaryItem = CommonDictionaryItem;
export type ExamTemplateStatusesDictionaryItem = CommonDictionaryItem;
export type KitTemplateStatusesDictionaryItem = CommonDictionaryItem;
export type SampleTypeDictionaryItem = CommonDictionaryItem;
export type SexTypeDictionaryItem = CommonDictionaryItem;
export type OrganizationDictionaryItem = CommonDictionaryItem;
export type PositionDictionaryItem = CommonDictionaryItem;
export type ParameterTypeDictionaryItem = CommonDictionaryItem;
export type ParameterViewTypeDictionaryItem = CommonDictionaryItem;
export type ParameterConditionTypeDictionaryItem = CommonDictionaryItem & { alias: string | null };
export type ReferenceColorsDictionaryItem = CommonDictionaryItem;
export type UrgencyTypesDictionaryItem = CommonDictionaryItem;
export type PhoneTypeDictionaryItem = CommonDictionaryItem;
export type EmailTypeDictionaryItem = CommonDictionaryItem;

export type UserRoleDictionaryItem = {
    id: ID;
    name: string;
    attribute: string;
};

export interface MeasurementUnitItem extends CommonDictionaryItem {
    abbreviation: string;
}

export interface WorkplaceDictionaryItem extends CommonDictionaryItem {
    uuid: string;
}

export interface DamageTypesDictionaryItem {
    id: ID;
    description: string;
    code: string;
    notes: string;
}
