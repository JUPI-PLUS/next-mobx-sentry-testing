// helpers
import { limsClient } from "../config";
import { TEMPLATES_ENDPOINTS } from "./endpoints";

// models
import { PromisedServerResponse } from "../../shared/models/axios";
import { TemplateRequestResponse, MoveGroupRequest } from "../../modules/Templates/models";
import { Template } from "../../shared/models/business/template";

// TODO: change the usage of this endpoint from useMutation to useQuery
export const getListOfTemplates = (queryFilters = ""): PromisedServerResponse<Array<Template>> =>
    limsClient.get(TEMPLATES_ENDPOINTS.list(queryFilters));

export const getParentsOfTemplate = (uuid: string): PromisedServerResponse<Array<Pick<Template, "name" | "uuid">>> =>
    limsClient.get(TEMPLATES_ENDPOINTS.parents(uuid));

export const patchTemplate =
    (uuid: string) =>
    (body: { name: string }): PromisedServerResponse<TemplateRequestResponse> =>
        limsClient.patch(TEMPLATES_ENDPOINTS.item(uuid), body);

export const moveGroupToParent = ({ body, uuid }: MoveGroupRequest): PromisedServerResponse<TemplateRequestResponse> =>
    limsClient.patch(TEMPLATES_ENDPOINTS.parent(uuid), body);

export const deleteTemplate = (uuid: string): PromisedServerResponse<TemplateRequestResponse> =>
    limsClient.delete(TEMPLATES_ENDPOINTS.item(uuid));

export const createGroup = (body: {
    name: string;
    parent_uuid?: string;
}): PromisedServerResponse<TemplateRequestResponse> => limsClient.post(TEMPLATES_ENDPOINTS.root, body);
