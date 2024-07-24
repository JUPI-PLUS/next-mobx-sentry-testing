//  libs
import React, { useMemo } from "react";
import { useMutation, useQuery } from "react-query";
import { AxiosError } from "axios";

// api
import { getEmailTypes } from "../../../../api/dictionaries";
import { createEmail, editEmail } from "../../../../api/emails";

//  helpers
import { schema } from "./schema";
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";
import { handleServerMessageLocaliseId } from "../../../../shared/utils/form";

//  models
import { EmailContactDrawerProps, EmailContactFormFields } from "./models";
import { BaseFormServerValidation, ServerResponse } from "../../../../shared/models/axios";
import { EmailContact, EmailContactBody } from "../../../../shared/models/emails";

// constants
import { ALREADY_ASSOCIATED_EMAIL_MESSAGE_LOCALISE_ID, DEFAULT_EMAIL_TYPE_ID } from "./constants";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

//  components
import FormDrawer from "../../../uiKit/Drawer/FormDrawer";
import { showSuccessToast } from "../../../uiKit/Toast/helpers";
import EmailContactForm from "./EmailContactForm";

const EmailContactDrawer = ({ isOpen, contact, onRefetchData, onClose, userUUID }: EmailContactDrawerProps) => {
    const isEdit = Boolean(contact);

    const { data: emailTypesLookup = [], isFetching: isFetchingEmailTypesLookup } = useQuery(
        DICTIONARIES_QUERY_KEYS.EMAIL_TYPES,
        getEmailTypes,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const {
        mutateAsync: mutateAsyncCreate,
        error: errorCreate,
        isError: isErrorCreate,
    } = useMutation<ServerResponse<EmailContact>, AxiosError<BaseFormServerValidation>, EmailContactBody>(createEmail, {
        onSuccess: async () => {
            await onRefetchData?.();
            showSuccessToast({ title: "Email has been created" });
            onClose();
        },
        onError: async error => {
            if (handleServerMessageLocaliseId(error) === ALREADY_ASSOCIATED_EMAIL_MESSAGE_LOCALISE_ID) {
                await onRefetchData?.();
            }
        },
    });

    const {
        mutateAsync: mutateAsyncEdit,
        error: errorEdit,
        isError: isErrorEdit,
    } = useMutation<
        ServerResponse<EmailContact>,
        AxiosError<BaseFormServerValidation>,
        Omit<EmailContactBody, "user_uuid">
    >(editEmail(contact?.uuid || ""), {
        onSuccess: async () => {
            await onRefetchData?.();
            showSuccessToast({ title: "Email has been updated" });
            onClose();
        },
        onError: async error => {
            if (handleServerMessageLocaliseId(error) === ALREADY_ASSOCIATED_EMAIL_MESSAGE_LOCALISE_ID) {
                await onRefetchData?.();
            }
        },
    });

    const defaultValues = useMemo(() => {
        return isEdit
            ? {
                  type_id: getLookupItem(emailTypesLookup, contact!.type_id),
                  email: contact!.email,
              }
            : {
                  type_id: getLookupItem(emailTypesLookup, DEFAULT_EMAIL_TYPE_ID),
                  email: "",
              };
    }, [contact, emailTypesLookup, isEdit]);

    const handleSubmit = async (formFields: EmailContactFormFields) => {
        try {
            if (isEdit) {
                await mutateAsyncEdit({ type_id: formFields.type_id!.value, email: formFields.email });
            } else {
                await mutateAsyncCreate({
                    user_uuid: userUUID,
                    type_id: formFields.type_id!.value,
                    email: formFields.email,
                });
            }
        } catch (e) {}
    };

    if (!isOpen || isFetchingEmailTypesLookup) return null;

    return (
        <FormDrawer
            isOpen
            schema={schema}
            defaultValues={defaultValues}
            onClose={onClose}
            onCancel={onClose}
            onSubmit={handleSubmit}
            submitText="Submit"
            title={isEdit ? "Edit email" : "Add email"}
            couldCloseOnBackdrop
            couldCloseOnEsc
            side="right"
            size="lg"
            containerClass="z-50"
            disableOnCleanFields
        >
            <EmailContactForm
                isError={isErrorEdit || isErrorCreate}
                errors={errorEdit || errorCreate}
                emailTypesLookup={emailTypesLookup}
                isVerified={Boolean(contact?.verified_at)}
            />
        </FormDrawer>
    );
};

export default EmailContactDrawer;
