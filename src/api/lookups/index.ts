import { limsClient } from "../config";
import { LOOKUPS_ENDPOINTS } from "./endpoints";
import {
    DamageTypesDictionaryItem,
    UrgencyTypesDictionaryItem,
    WorkplaceDictionaryItem,
} from "../../shared/models/dictionaries";
import { PromisedServerResponse } from "../../shared/models/axios";

export const getWorkplacesLookup = (): PromisedServerResponse<WorkplaceDictionaryItem[]> =>
    limsClient.get(LOOKUPS_ENDPOINTS.workplaces());

export const getUrgencyTypesLookup = (): PromisedServerResponse<UrgencyTypesDictionaryItem[]> =>
    limsClient.get(LOOKUPS_ENDPOINTS.urgencyTypes());

export const getDamageTypesLookup = (): PromisedServerResponse<DamageTypesDictionaryItem[]> =>
    limsClient.get(LOOKUPS_ENDPOINTS.damageTypes());
