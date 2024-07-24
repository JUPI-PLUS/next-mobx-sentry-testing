// helpers
import { limsClient } from "../config";
import { PARAMS_GROUPS_ENDPOINTS } from "./endpoints";

// models
import { PromisedServerResponse } from "../../shared/models/axios";
import {
    ParamsGroupMutationData,
    ParamsGroupMutationResponse,
} from "../../modules/ExamTemplate/components/ExamTemplateParameters/components/ExamTemplateActionDialogs/components/GroupDialog/models";

export const createParamsGroup = (
    paramsGroupData: ParamsGroupMutationData
): PromisedServerResponse<ParamsGroupMutationResponse> =>
    limsClient.post(PARAMS_GROUPS_ENDPOINTS.root, paramsGroupData);

export const editParamsGroup =
    (uuid: string) =>
    (paramsGroupData: ParamsGroupMutationData): PromisedServerResponse<ParamsGroupMutationResponse> =>
        limsClient.patch(PARAMS_GROUPS_ENDPOINTS.item(uuid), paramsGroupData);

export const deleteParamsGroup = (uuid: string) => (): PromisedServerResponse =>
    limsClient.delete(PARAMS_GROUPS_ENDPOINTS.item(uuid));
