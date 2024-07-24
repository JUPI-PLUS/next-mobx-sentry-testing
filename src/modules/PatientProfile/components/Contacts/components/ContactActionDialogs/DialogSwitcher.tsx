// libs
import { observer } from "mobx-react";

// stores
import { useContactsStore } from "../../store";

// models
import { ContactActionsEnum } from "../../models";

// constants
import { CONTACT_TYPES } from "../../constants";

// components
import DeleteContactDialog from "./DeleteContactDialog";
import ContactDrawer from "./ContactDrawer";
import ContactVerificationDrawer from "./ContactVerificationDrawer";

const DialogSwitcher = () => {
    const {
        contactsStore: { actionType },
    } = useContactsStore();

    switch (actionType) {
        case ContactActionsEnum.DELETE_EMAIL:
            return <DeleteContactDialog type={CONTACT_TYPES.EMAIL} />;
        case ContactActionsEnum.DELETE_PHONE:
            return <DeleteContactDialog type={CONTACT_TYPES.PHONE} />;
        case ContactActionsEnum.EDIT_EMAIL:
        case ContactActionsEnum.ADD_EMAIL:
            return <ContactDrawer type={CONTACT_TYPES.EMAIL} />;
        case ContactActionsEnum.EDIT_PHONE:
        case ContactActionsEnum.ADD_PHONE:
            return <ContactDrawer type={CONTACT_TYPES.PHONE} />;
        case ContactActionsEnum.VERIFY_EMAIL:
            return <ContactVerificationDrawer type={CONTACT_TYPES.EMAIL} />;
        case ContactActionsEnum.VERIFY_PHONE:
            return <ContactVerificationDrawer type={CONTACT_TYPES.PHONE} />;
        default:
            return null;
    }
};

export default observer(DialogSwitcher);
