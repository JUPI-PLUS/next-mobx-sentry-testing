// config
import { limsClient } from "../config";

// models
import { PromisedServerResponse } from "../../shared/models/axios";
import { ParameterOption } from "../../modules/ParameterOptions/components/ParameterOptionsTable/models";
import { Parameter } from "../../shared/models/business/parameter";
import { OptionFormData } from "../../modules/ParameterOptions/models";

// api
import { PARAMETER_OPTIONS_ENDPOINTS } from "./endpoints";

export const listOfParameterOptions = (page: number, filters = ""): PromisedServerResponse<ParameterOption, "list"> =>
    limsClient.get(PARAMETER_OPTIONS_ENDPOINTS.list(page, filters));

export const autocompleteParameterOptions = (filters = ""): PromisedServerResponse<ParameterOption[]> =>
    limsClient.get(PARAMETER_OPTIONS_ENDPOINTS.autocomplete(filters));

export const createParameterOption = (body: OptionFormData): PromisedServerResponse<ParameterOption> =>
    limsClient.post(PARAMETER_OPTIONS_ENDPOINTS.root, body);

export const updateParameterOption =
    (id: number) =>
    (body: OptionFormData): PromisedServerResponse<ParameterOption> =>
        limsClient.patch(PARAMETER_OPTIONS_ENDPOINTS.item(id), body);

export const assignedParametersToOption = (id: number) => (): PromisedServerResponse<Parameter[]> =>
    limsClient.get(PARAMETER_OPTIONS_ENDPOINTS.assignedParams(id));

export const deleteParameterOption = (id: number): PromisedServerResponse =>
    limsClient.delete(PARAMETER_OPTIONS_ENDPOINTS.item(id));
