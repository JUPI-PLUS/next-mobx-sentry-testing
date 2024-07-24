// helpers
import { limsClient } from "../config";

// models
import { PromisedServerResponse } from "../../shared/models/axios";
import { EmailContact, EmailContactBody } from "../../shared/models/emails";

// constants
import { EMAILS_ENDPOINTS } from "./endpoints";

export const getEmailsList = (userUUID: string) => (): PromisedServerResponse<EmailContact[]> =>
    limsClient.get(EMAILS_ENDPOINTS.list(userUUID));

export const createEmail = (emailData: EmailContactBody): PromisedServerResponse<EmailContact> =>
    limsClient.post(EMAILS_ENDPOINTS.root, emailData);

export const editEmail =
    (uuid: string) =>
    (emailData: Omit<EmailContactBody, "user_uuid">): PromisedServerResponse<EmailContact> =>
        limsClient.patch(EMAILS_ENDPOINTS.item(uuid), emailData);

export const deleteEmail = (uuid: string) => (): PromisedServerResponse =>
    limsClient.delete(EMAILS_ENDPOINTS.item(uuid));

export const setEmailPrimary = (uuid: string) => (): PromisedServerResponse =>
    limsClient.patch(EMAILS_ENDPOINTS.setPrimary(uuid));
