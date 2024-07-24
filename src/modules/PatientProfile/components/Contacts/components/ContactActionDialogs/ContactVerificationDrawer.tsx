//  libs
import { observer } from "mobx-react";
// import { AxiosError } from "axios";
// import { useMutation } from "react-query";

// stores
import { useContactsStore } from "../../store";
// import { usePatientStore } from "../../../../store";

// api
// import { sendVerificationPatientContact, verifyPatientContact } from "../../../../../../api/users";

// helpers
// import { removeVerificationFromStorage } from "../../../../../../shared/utils/verification";
// import { queryClient } from "../../../../../../../pages/_app";

// models
// import { BaseFormServerValidation, ServerResponse } from "../../../../../../shared/models/axios";
import { CodeVerificationFormFields } from "../../../../../../components/UserDrawers/VerificationDrawer/models";

// constants
import {
    // CONTACT_TYPES,
    DEFAULT_VERIFICATION_CODE_LENGTH,
} from "../../constants";
// import { EMAILS_QUERY_KEYS, PHONES_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";

//  components
// import { showErrorToast, showSuccessToast } from "../../../../../../components/uiKit/Toast/helpers";
import VerificationDrawer from "../../../../../../components/UserDrawers/VerificationDrawer/VerificationDrawer";

const ContactVerificationDrawer = ({ type }: { type: string }) => {
    // const {
    //     patientStore: { patient },
    // } = usePatientStore();
    const {
        contactsStore: {
            contactToVerify,
            setContactToVerify,
            // setNewContactToVerify,
            setSelectedContact,
            setupActionType,
        },
    } = useContactsStore();

    // TODO: uncomment and use after BE implementation of verification flow
    // const { mutate: mutateSendVerification, isLoading: isSendVerificationLoading } = useMutation<
    //     ServerResponse,
    //     AxiosError<BaseFormServerValidation>
    // >(sendVerificationPatientContact(patient!.uuid, contactToVerify!.uuid), {
    //     onSuccess: () => {
    //         setNewContactToVerify(patient!.uuid, contactToVerify!);
    //     },
    //     onError: () => {
    //         showErrorToast({ title: "Something went wrong" });
    //     },
    // });

    // const { mutateAsync: mutateAsyncVerify, error } = useMutation<
    //     ServerResponse,
    //     AxiosError<BaseFormServerValidation>,
    //     CodeVerificationFormFields
    // >(verifyPatientContact(patient!.uuid), {
    //     onSuccess: async () => {
    //         if (type === CONTACT_TYPES.EMAIL) {
    //             await queryClient.refetchQueries(PHONES_QUERY_KEYS.LIST(patient!.uuid));
    //         } else {
    //             await queryClient.refetchQueries(EMAILS_QUERY_KEYS.LIST(patient!.uuid));
    //         }
    //         removeVerificationFromStorage(patient!.uuid, contactToVerify!.uuid);
    //         showSuccessToast({ title: "Contact has been verified" });
    //         onClose();
    //     },
    // });

    const onSubmit = async (formFields: CodeVerificationFormFields) => {
        try {
            // await mutateAsyncVerify(formFields);
        } catch (e) {}
    };

    const onResend = () => {
        // mutateSendVerification();
    };

    const onClose = () => {
        setContactToVerify(null);
        setSelectedContact(null);
        setupActionType(null);
    };

    return (
        <VerificationDrawer
            verificationField={contactToVerify!}
            isOpen
            codeLength={DEFAULT_VERIFICATION_CODE_LENGTH}
            onSubmit={onSubmit}
            onResend={onResend}
            // isResendDisabled={isSendVerificationLoading}
            isResendDisabled={true}
            onClose={onClose}
            // error={error}
            error={null}
            type={type}
        />
    );
};
export default observer(ContactVerificationDrawer);
