import { PromisedServerResponse } from "../../shared/models/axios";
import { limsClient } from "../config";
import { KITS_ENDPOINTS } from "./endpoints";
import { ExamTemplate } from "../../shared/models/business/exam";
import { Kit } from "../../shared/models/business/kit";
import { KitTemplate, KitTemplateBody } from "../../modules/KitTemplate/components/KitForm/models";
import { MoveExamKitRequest } from "../../modules/Templates/models";
import { OrderConditionResponse } from "../../modules/KitActivation/models";

export const getListOfKits = (): PromisedServerResponse<Kit[]> => limsClient.get(KITS_ENDPOINTS.root);

export const createKitTemplate = (kitTemplateData: KitTemplateBody): PromisedServerResponse<KitTemplate> =>
    limsClient.post(KITS_ENDPOINTS.root, kitTemplateData);

export const editKitTemplate =
    (uuid: string) =>
    (kitTemplateData: KitTemplateBody): PromisedServerResponse<KitTemplate> =>
        limsClient.patch(KITS_ENDPOINTS.kitTemplate(uuid), kitTemplateData);

export const getKitTemplate = (uuid: string) => (): PromisedServerResponse<KitTemplate> =>
    limsClient.get(KITS_ENDPOINTS.kitTemplate(uuid));

export const deleteKitTemplate = (uuid: string) => (): PromisedServerResponse =>
    limsClient.delete(KITS_ENDPOINTS.kitTemplate(uuid));

export const getExamTemplatesByKitUUID = (kitUUID: string) => (): PromisedServerResponse<ExamTemplate[]> =>
    limsClient.get(KITS_ENDPOINTS.examTemplates(kitUUID));

export const getExamsTemplatesByKitCode = (kitUUID: string) => (): PromisedServerResponse<ExamTemplate[]> =>
    limsClient.get(KITS_ENDPOINTS.examsTemplates(kitUUID));

export const getOrderConditionsByKitCode =
    (kitCode: string) => (): PromisedServerResponse<Array<OrderConditionResponse>> =>
        limsClient.get(KITS_ENDPOINTS.orderConditions(kitCode));

export const moveKitTemplatesToGroup = ({ body, uuid }: MoveExamKitRequest): PromisedServerResponse<KitTemplate> =>
    limsClient.patch(KITS_ENDPOINTS.group(uuid), body);
