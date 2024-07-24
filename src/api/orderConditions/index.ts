import { PromisedServerResponse } from "../../shared/models/axios";
import { limsClient } from "../config";
import { ORDER_CONDITIONS_ENDPOINTS } from "./endpoints";
import { EXAM_TEMPLATES_ENDPOINTS } from "../examTemplates/endpoints";
import { OrderConditionResponse, PatchOrderConditionsRequest } from "../../modules/CreateOrder/models";

export const getOrderConditionsByExamTemplateUUIDs =
    (examTemplateUUIDS: { exam_templates: Array<string> }) =>
    (): PromisedServerResponse<Array<OrderConditionResponse>> =>
        limsClient.post(EXAM_TEMPLATES_ENDPOINTS.orderConditions(), examTemplateUUIDS);

export const patchOrderConditions = ({ conditions, uuid }: PatchOrderConditionsRequest): PromisedServerResponse =>
    limsClient.patch(ORDER_CONDITIONS_ENDPOINTS.item(uuid), conditions);
