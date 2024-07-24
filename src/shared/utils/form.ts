import { AxiosError } from "axios";
import { BaseFormServerValidation, ServerFormValidationError } from "../models/axios";

export const handleServerFormValidation = (
    error: AxiosError<BaseFormServerValidation> | null
): ServerFormValidationError[] => {
    if (error === null) return [];

    return error.response?.data.errors ?? [];
};

export const handleServerNotificationError = (error: AxiosError<BaseFormServerValidation> | null) => {
    if (error === null) return "";

    const errorMessage = error.response?.data?.message;
    return typeof errorMessage === "string" ? errorMessage : "";
};

export const handleServerMessageLocaliseId = (error: AxiosError<BaseFormServerValidation> | null): string | null => {
    if (error === null) return "";

    const messageLocaliseId = error.response?.data.errors[0].messageLocaliseId[0];
    return messageLocaliseId || null;
};
