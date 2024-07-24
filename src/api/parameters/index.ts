// helpers
import { limsClient } from "../config";
import { PARAMETERS_ENDPOINTS } from "./endpoints";

// models
import { PromisedServerResponse } from "../../shared/models/axios";
import { Parameter } from "../../shared/models/business/parameter";
import { CreateParameterBody } from "../../components/ParameterDrawers/AssingOrCreateParameter/models";
import { ExaminationTemplate } from "../../shared/models/business/examTemplate";
import { ServerParameterConditionGroups } from "../../components/ParameterDrawers/components/ParameterConditions/models";

export const getParametersList = (page: number, filters: string): PromisedServerResponse<Parameter, "list"> =>
    limsClient.get(PARAMETERS_ENDPOINTS.list(page, filters));

export const getParameter = (uuid: string) => (): PromisedServerResponse<Parameter> =>
    limsClient.get(PARAMETERS_ENDPOINTS.item(uuid));

export const getParameters = (search?: string) => (): PromisedServerResponse<Parameter, "list"> =>
    limsClient.get(PARAMETERS_ENDPOINTS.autocomplete(search));

export const createParameter = (data: CreateParameterBody): PromisedServerResponse<Parameter> =>
    limsClient.post(PARAMETERS_ENDPOINTS.root, data);

export const editParameter =
    (uuid: string) =>
    (data: CreateParameterBody): PromisedServerResponse<Parameter> =>
        limsClient.patch(PARAMETERS_ENDPOINTS.item(uuid), data);

export const getExamTemplatesByParamUUID = (uuid: string) => (): PromisedServerResponse<ExaminationTemplate[]> =>
    limsClient.get(PARAMETERS_ENDPOINTS.examTemplatesByUUID(uuid));

export const deleteParameter = (uuid: string) => (): PromisedServerResponse =>
    limsClient.delete(PARAMETERS_ENDPOINTS.item(uuid));

export const getParameterConditions = (uuid: string) => (): PromisedServerResponse<ServerParameterConditionGroups[]> =>
    limsClient.get(PARAMETERS_ENDPOINTS.conditions(uuid));

export const createParameterConditions =
    (uuid: string) =>
    (body: ServerParameterConditionGroups[]): PromisedServerResponse =>
        limsClient.post(PARAMETERS_ENDPOINTS.conditions(uuid), body);
