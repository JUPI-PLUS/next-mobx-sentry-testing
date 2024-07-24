import { limsClient } from "../config";
import { DICTIONARIES_ENDPOINTS } from "./endpoints";
import {
    ExamStatusDictionaryItem,
    ExamTemplateStatusDictionaryItem,
    GeneralStatusDictionaryItem,
    KitTemplateStatusDictionaryItem,
    MeasurementUnitItem,
    OrderStatusDictionaryItem,
    OrganizationDictionaryItem,
    ParameterConditionTypeDictionaryItem,
    ParameterTypeDictionaryItem,
    ParameterViewTypeDictionaryItem,
    PositionDictionaryItem,
    ReferenceColorsDictionaryItem,
    SampleTypeDictionaryItem,
    SexTypeDictionaryItem,
    UserRoleDictionaryItem,
    PhoneTypeDictionaryItem,
    EmailTypeDictionaryItem,
} from "../../shared/models/dictionaries";
import { PromisedServerResponse } from "../../shared/models/axios";
import { ExamTemplate } from "../../shared/models/business/exam";

export const getOrderStatuses = (): PromisedServerResponse<OrderStatusDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.orderStatuses());

export const getMeasurementUnits = (): PromisedServerResponse<MeasurementUnitItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.measurementUnits());

export const getExamStatuses = (): PromisedServerResponse<ExamStatusDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.examStatuses());

export const getKitTemplateStatuses = (): PromisedServerResponse<KitTemplateStatusDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.kitTemplateStatuses());

export const getExamTemplateStatuses = (): PromisedServerResponse<ExamTemplateStatusDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.examTemplateStatuses());

export const getGeneralStatuses = (): PromisedServerResponse<GeneralStatusDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.generalStatuses());

export const getSampleStatuses = (): PromisedServerResponse<ExamStatusDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.sampleStatuses());

export const getExamTemplates = (): PromisedServerResponse<ExamTemplate[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.examTemplates());

export const getSampleTypes = (): PromisedServerResponse<SampleTypeDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.sampleTypes());

export const getUserRoles = (): PromisedServerResponse<UserRoleDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.userRoles());

export const getSexTypes = (): PromisedServerResponse<SexTypeDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.sexTypes());

export const getOrganizations = (): PromisedServerResponse<OrganizationDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.organizations());

export const getPositions = (): PromisedServerResponse<PositionDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.positions());

export const getReferenceColors = (): PromisedServerResponse<ReferenceColorsDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.referenceColors());

// Maybe deprecated
export const getParameterTypes = (): PromisedServerResponse<ParameterTypeDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.parameterTypes());

export const getParameterViewTypes = (): PromisedServerResponse<ParameterViewTypeDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.parameterViewTypes());

export const getConditionTypes = (): PromisedServerResponse<ParameterConditionTypeDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.conditionTypes());

export const getPhoneTypes = (): PromisedServerResponse<PhoneTypeDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.phoneTypes());

export const getEmailTypes = (): PromisedServerResponse<EmailTypeDictionaryItem[]> =>
    limsClient.get(DICTIONARIES_ENDPOINTS.emailTypes());
