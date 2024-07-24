// helpers
import { limsClient } from "../config";
import { EXAM_TEMPLATES_ENDPOINTS } from "./endpoints";

// models
import { PromisedServerResponse } from "../../shared/models/axios";
import { ExaminationTemplate, AddEditParamToExamTemplate } from "../../shared/models/business/examTemplate";
import { ExamInfoFormMutation } from "../../modules/ExamTemplate/components/ExamTemplateGeneralInfo/models";
import { ParamsRelationsData } from "../../modules/ExamTemplate/components/ExamTemplateParameters/models";
import { KitTemplate } from "../../modules/KitTemplate/components/KitForm/models";

export const createExamTemplate = (
    examTemplateFormData: ExamInfoFormMutation
): PromisedServerResponse<ExaminationTemplate> => limsClient.post(EXAM_TEMPLATES_ENDPOINTS.root, examTemplateFormData);

export const editExamTemplate =
    (uuid: string) =>
    (examTemplateFormData: ExamInfoFormMutation): PromisedServerResponse<ExaminationTemplate> =>
        limsClient.patch(EXAM_TEMPLATES_ENDPOINTS.item(uuid), examTemplateFormData);

export const getExamTemplateInfo = (uuid: string) => (): PromisedServerResponse<ExaminationTemplate> =>
    limsClient.get(EXAM_TEMPLATES_ENDPOINTS.item(uuid));

export const getExamTemplateParams = (uuid: string) => (): PromisedServerResponse<AddEditParamToExamTemplate[]> =>
    limsClient.get(EXAM_TEMPLATES_ENDPOINTS.params(uuid));

export const setParamsRelations =
    (uuid: string) =>
    (data: ParamsRelationsData): PromisedServerResponse =>
        limsClient.post(EXAM_TEMPLATES_ENDPOINTS.params(uuid), data);

export const getKitTemplatesRelations = (uuid: string) => (): PromisedServerResponse<KitTemplate[]> =>
    limsClient.get(EXAM_TEMPLATES_ENDPOINTS.kitTemplates(uuid));

export const deleteExamTemplate = (uuid: string) => (): PromisedServerResponse =>
    limsClient.delete(EXAM_TEMPLATES_ENDPOINTS.item(uuid));
