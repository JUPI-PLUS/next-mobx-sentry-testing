// libs
import React from "react";
// import { useMutation } from "react-query";
// import { AxiosError } from "axios";
import { observer } from "mobx-react";

// stores
import { useContactsStore } from "../../../../store";

// api
// import { sendVerificationPatientContact } from "../../../../../../../../api/users";

// helpers
import { getVerificationFromStorageByUuid } from "../../../../../../../../shared/utils/verification";

// models
import { VerificationCellProps } from "./models";
// import { BaseFormServerValidation, ServerResponse } from "../../../../../../../../shared/models/axios";
import { ContactActionsEnum } from "../../../../models";

// constants
import { CONTACT_TYPES } from "../../../../constants";

// components
import CheckIcon from "../../../../../../../../components/uiKit/Icons/CheckIcon";
import { TextButton } from "../../../../../../../../components/uiKit/Button/Button";
// import { showErrorToast } from "../../../../../../../../components/uiKit/Toast/helpers";

const VerificationCell = ({ userUUID, isVerified, uuid, value, type }: VerificationCellProps) => {
    const {
        contactsStore: {
            // setNewContactToVerify,
            setContactToVerify,
            setupActionType,
        },
    } = useContactsStore();

    // TODO: uncomment and use after BE implementation of verification flow
    // const { mutate, isLoading } = useMutation<ServerResponse, AxiosError<BaseFormServerValidation>>(
    //     sendVerificationPatientContact(userUUID, uuid),
    //     {
    //         onSuccess: () => {
    //             setNewContactToVerify(userUUID, { value, uuid });
    //             setActionByType();
    //         },
    //         onError: () => {
    //             showErrorToast({ title: "Something went wrong" });
    //         },
    //     }
    // );

    const setActionByType = () =>
        setupActionType(
            type === CONTACT_TYPES.EMAIL ? ContactActionsEnum.VERIFY_EMAIL : ContactActionsEnum.VERIFY_PHONE
        );

    const onVerify = () => {
        const targetTimeFromStorage = getVerificationFromStorageByUuid(userUUID, uuid);
        if (targetTimeFromStorage) {
            setContactToVerify({ value, uuid, targetTime: targetTimeFromStorage });
            setActionByType();
        } else {
            // mutate();
        }
    };

    if (isVerified)
        return (
            <p className="font-bold text-md text-green-100 flex items-center">
                <CheckIcon className="inline-block stroke-green-100 mr-2" />
                Verified
            </p>
        );

    return (
        <TextButton
            size="thin"
            variant="neutral"
            className="font-normal"
            data-testid="contact-verify-button"
            text="Verify"
            onClick={onVerify}
            // disabled={isLoading}
        />
    );
};
export default observer(VerificationCell);
