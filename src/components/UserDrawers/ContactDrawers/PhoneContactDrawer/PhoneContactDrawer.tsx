//  libs
import React, { useMemo } from "react";
import { useMutation, useQuery } from "react-query";
import { AxiosError } from "axios";
import { usePhone } from "react-international-phone";

// api
import { getPhoneTypes } from "../../../../api/dictionaries";
import { createPhone, editPhone } from "../../../../api/phones";

//  helpers
import { schema } from "./schema";
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";
import { trimPhoneNumber } from "../../../../shared/utils/string";
import { handleServerMessageLocaliseId } from "../../../../shared/utils/form";

//  models
import { PhoneContactDrawerProps, PhoneContactFormFields } from "./models";
import { BaseFormServerValidation, ServerResponse } from "../../../../shared/models/axios";
import { PhoneContact, PhoneContactBody } from "../../../../shared/models/phones";

// constants
import { ALREADY_ASSOCIATED_PHONE_MESSAGE_LOCALISE_ID, DEFAULT_PHONE_TYPE_ID } from "./constants";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

//  components
import FormDrawer from "../../../uiKit/Drawer/FormDrawer";
import { showSuccessToast } from "../../../uiKit/Toast/helpers";
import PhoneContactForm from "./PhoneContactForm";

const PhoneContactDrawer = ({ isOpen, contact, onRefetchData, onClose, userUUID }: PhoneContactDrawerProps) => {
    const isEdit = Boolean(contact);
    const { phone } = usePhone(contact?.number ?? "");
    const typeId = contact?.type_id ?? DEFAULT_PHONE_TYPE_ID;

    const { data: phoneTypesLookup = [], isFetching: isFetchingPhoneTypesLookup } = useQuery(
        DICTIONARIES_QUERY_KEYS.PHONE_TYPES,
        getPhoneTypes,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const {
        mutateAsync: mutateAsyncCreate,
        error: errorCreate,
        isError: isErrorCreate,
    } = useMutation<ServerResponse<PhoneContact>, AxiosError<BaseFormServerValidation>, PhoneContactBody>(createPhone, {
        onSuccess: async () => {
            await onRefetchData?.();
            showSuccessToast({ title: "Phone has been created" });
            onClose();
        },
        onError: async error => {
            if (handleServerMessageLocaliseId(error) === ALREADY_ASSOCIATED_PHONE_MESSAGE_LOCALISE_ID) {
                await onRefetchData?.();
            }
        },
    });

    const {
        mutateAsync: mutateAsyncEdit,
        error: errorEdit,
        isError: isErrorEdit,
    } = useMutation<
        ServerResponse<PhoneContact>,
        AxiosError<BaseFormServerValidation>,
        Omit<PhoneContactBody, "user_uuid">
    >(editPhone(contact?.uuid || ""), {
        onSuccess: async () => {
            await onRefetchData?.();
            showSuccessToast({ title: "Phone has been updated" });
            onClose();
        },
        onError: async error => {
            if (handleServerMessageLocaliseId(error) === ALREADY_ASSOCIATED_PHONE_MESSAGE_LOCALISE_ID) {
                await onRefetchData?.();
            }
        },
    });

    const defaultValues = useMemo(() => {
        return isEdit
            ? {
                  type_id: getLookupItem(phoneTypesLookup, typeId),
                  number: phone,
              }
            : {
                  type_id: getLookupItem(phoneTypesLookup, DEFAULT_PHONE_TYPE_ID),
                  number: "",
              };
    }, [phone, typeId, phoneTypesLookup, isEdit]);

    const handleSubmit = async (formFields: PhoneContactFormFields) => {
        try {
            if (isEdit) {
                await mutateAsyncEdit({
                    type_id: formFields.type_id!.value,
                    number: trimPhoneNumber(formFields.number),
                });
            } else {
                await mutateAsyncCreate({
                    user_uuid: userUUID,
                    type_id: formFields.type_id!.value,
                    number: trimPhoneNumber(formFields.number),
                });
            }
        } catch (e) {}
    };

    if (!isOpen || isFetchingPhoneTypesLookup) return null;

    return (
        <FormDrawer
            isOpen
            schema={schema}
            defaultValues={defaultValues}
            onClose={onClose}
            onCancel={onClose}
            onSubmit={handleSubmit}
            submitText="Submit"
            title={isEdit ? "Edit phone number" : "Add phone number"}
            couldCloseOnBackdrop
            couldCloseOnEsc
            side="right"
            size="lg"
            containerClass="z-50"
            disableOnCleanFields
        >
            <PhoneContactForm
                isError={isErrorEdit || isErrorCreate}
                errors={errorEdit || errorCreate}
                phoneTypesLookup={phoneTypesLookup}
                isVerified={Boolean(contact?.verified_at)}
            />
        </FormDrawer>
    );
};

export default PhoneContactDrawer;
