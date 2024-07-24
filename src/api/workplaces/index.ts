// helpers
import { limsClient } from "../config";
import { WORKPLACES_ENDPOINTS } from "./endpoints";

// models
import { PromisedServerResponse } from "../../shared/models/axios";
import { Workplace } from "../../shared/models/business/workplace";
import { WorkplaceBody } from "../../modules/Workplace/models";
import { ExamTemplate } from "../../shared/models/business/exam";

export const getWorkplacesList = (page: number, filters: string): PromisedServerResponse<Workplace, "list"> =>
    limsClient.get(WORKPLACES_ENDPOINTS.list(page, filters));

export const getWorkplace = (uuid: string) => (): PromisedServerResponse<Workplace> =>
    limsClient.get(WORKPLACES_ENDPOINTS.item(uuid));

export const createWorkplace = (data: WorkplaceBody): PromisedServerResponse<Workplace> =>
    limsClient.post(WORKPLACES_ENDPOINTS.root, data);

export const editWorkplace =
    (uuid: string) =>
    (data: WorkplaceBody): PromisedServerResponse<Workplace> =>
        limsClient.patch(WORKPLACES_ENDPOINTS.item(uuid), data);

export const getExamTemplatesByWorkplaceUUID = (uuid: string) => (): PromisedServerResponse<ExamTemplate[]> =>
    limsClient.get(WORKPLACES_ENDPOINTS.examTemplatesByUUID(uuid));

export const deleteWorkplace = (uuid: string) => (): PromisedServerResponse =>
    limsClient.delete(WORKPLACES_ENDPOINTS.item(uuid));
