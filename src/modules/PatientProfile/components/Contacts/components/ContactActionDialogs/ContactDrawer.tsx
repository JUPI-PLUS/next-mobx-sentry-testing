// libs
import React from "react";
import { observer } from "mobx-react";

// stores
import { useContactsStore } from "../../store";
import { usePatientStore } from "../../../../store";

// helpers
import { queryClient } from "../../../../../../../pages/_app";

// models
import { EmailContact } from "../../../../../../shared/models/emails";
import { PhoneContact } from "../../../../../../shared/models/phones";

// constants
import { EMAILS_QUERY_KEYS, PHONES_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";
import { CONTACT_TYPES } from "../../constants";

// components
import EmailContactDrawer from "../../../../../../components/UserDrawers/ContactDrawers/EmailContactDrawer/EmailContactDrawer";
import PhoneContactDrawer from "../../../../../../components/UserDrawers/ContactDrawers/PhoneContactDrawer/PhoneContactDrawer";

const ContactDrawer = ({ type }: { type: string }) => {
    const {
        patientStore: { patient },
    } = usePatientStore();
    const {
        contactsStore: { selectedContact, setSelectedContact, setupActionType },
    } = useContactsStore();

    const onRefetchData = async () => {
        try {
            if (type === CONTACT_TYPES.EMAIL) {
                await queryClient.refetchQueries(EMAILS_QUERY_KEYS.LIST(patient!.uuid));
            } else {
                await queryClient.refetchQueries(PHONES_QUERY_KEYS.LIST(patient!.uuid));
            }
        } catch (e) {}
    };

    const onClose = () => {
        setSelectedContact(null);
        setupActionType(null);
    };

    switch (type) {
        case CONTACT_TYPES.EMAIL:
            return (
                <EmailContactDrawer
                    isOpen
                    contact={selectedContact as EmailContact | null}
                    onRefetchData={onRefetchData}
                    onClose={onClose}
                    userUUID={patient!.uuid}
                />
            );
        case CONTACT_TYPES.PHONE:
            return (
                <PhoneContactDrawer
                    isOpen
                    contact={selectedContact as PhoneContact | null}
                    onRefetchData={onRefetchData}
                    onClose={onClose}
                    userUUID={patient!.uuid}
                />
            );
        default:
            return null;
    }
};

export default observer(ContactDrawer);
