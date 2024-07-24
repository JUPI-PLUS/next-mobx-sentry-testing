// helpers
import { limsClient } from "../config";

// models
import { PromisedServerResponse } from "../../shared/models/axios";
import { PhoneContact, PhoneContactBody } from "../../shared/models/phones";

// constants
import { PHONES_ENDPOINTS } from "./endpoints";

export const getPhonesList = (userUUID: string) => (): PromisedServerResponse<PhoneContact[]> =>
    limsClient.get(PHONES_ENDPOINTS.list(userUUID));

export const createPhone = (phoneData: PhoneContactBody): PromisedServerResponse<PhoneContact> =>
    limsClient.post(PHONES_ENDPOINTS.root, phoneData);

export const editPhone =
    (uuid: string) =>
    (phoneData: Omit<PhoneContactBody, "user_uuid">): PromisedServerResponse<PhoneContact> =>
        limsClient.patch(PHONES_ENDPOINTS.item(uuid), phoneData);

export const deletePhone = (uuid: string) => (): PromisedServerResponse =>
    limsClient.delete(PHONES_ENDPOINTS.item(uuid));

export const setPhonePrimary = (uuid: string) => (): PromisedServerResponse =>
    limsClient.patch(PHONES_ENDPOINTS.setPrimary(uuid));
