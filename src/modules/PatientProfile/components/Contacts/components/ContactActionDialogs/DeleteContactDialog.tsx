// libs
import React from "react";
import { useMutation } from "react-query";
import { observer } from "mobx-react";
import { AxiosError } from "axios";

// stores
import { usePatientStore } from "../../../../store";
import { useContactsStore } from "../../store";

// api
import { deletePhone } from "../../../../../../api/phones";
import { deleteEmail } from "../../../../../../api/emails";

// helpers
import { queryClient } from "../../../../../../../pages/_app";

// models
import { BaseFormServerValidation, ServerResponse } from "../../../../../../shared/models/axios";

// constants
import { EMAILS_QUERY_KEYS, PHONES_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";
import { CONTACT_TYPES } from "../../constants";

// components
import Dialog from "../../../../../../components/uiKit/Dialog/Dialog";
import { showErrorToast, showSuccessToast } from "../../../../../../components/uiKit/Toast/helpers";

const DeleteContactDialog = ({ type }: { type: string }) => {
    const {
        patientStore: { patient },
    } = usePatientStore();
    const {
        contactsStore: { selectedContact, setSelectedContact, setupActionType },
    } = useContactsStore();

    const { mutateAsync: mutateAsyncDeleteEmail, isLoading: isLoadingDeleteEmail } = useMutation<
        ServerResponse,
        AxiosError<BaseFormServerValidation>
    >(deleteEmail(selectedContact!.uuid), {
        onSuccess: () => {
            showSuccessToast({ title: "Email has been deleted" });
        },
        onError: () => {
            showErrorToast({ title: "Email has already been deleted" });
        },
        onSettled: async () => {
            await queryClient.refetchQueries(EMAILS_QUERY_KEYS.LIST(patient!.uuid));
            onCloseDialog();
        },
    });

    const { mutateAsync: mutateAsyncDeletePhone, isLoading: isLoadingDeletePhone } = useMutation<
        ServerResponse,
        AxiosError<BaseFormServerValidation>
    >(deletePhone(selectedContact!.uuid), {
        onSuccess: () => {
            showSuccessToast({ title: "Phone has been deleted" });
        },
        onError: () => {
            showErrorToast({ title: "Phone has already been deleted" });
        },
        onSettled: async () => {
            await queryClient.refetchQueries(PHONES_QUERY_KEYS.LIST(patient!.uuid));
            onCloseDialog();
        },
    });

    const onCloseDialog = () => {
        setupActionType(null);
        setSelectedContact(null);
    };

    const onSubmitDelete = async () => {
        try {
            if (type === CONTACT_TYPES.EMAIL) {
                await mutateAsyncDeleteEmail();
            } else {
                await mutateAsyncDeletePhone();
            }
        } catch (e) {}
    };

    return (
        <>
            <Dialog
                isOpen
                onClose={onCloseDialog}
                onCancel={onCloseDialog}
                onSubmit={onSubmitDelete}
                isSubmitButtonDisabled={isLoadingDeleteEmail || isLoadingDeletePhone}
                title={type === CONTACT_TYPES.EMAIL ? "Delete email" : "Delete phone number"}
                submitText="Delete"
                cancelText="Cancel"
            >
                <p>Are you sure you want to delete this {type === CONTACT_TYPES.EMAIL ? "email" : "phone number"}?</p>
            </Dialog>
        </>
    );
};

export default observer(DeleteContactDialog);
