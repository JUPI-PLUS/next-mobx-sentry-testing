// libs
import React, { useEffect } from "react";
import { observer } from "mobx-react";

// stores
import { useContactsStore } from "./store";

// models
import { ContactsContainerProps } from "./models";

// components
import DialogSwitcher from "./components/ContactActionDialogs/DialogSwitcher";
import EmailsCard from "./components/ContactCards/EmailsCard";
import PhonesCard from "./components/ContactCards/PhonesCard";

const ContactsContainer = ({ uuid = "" }: ContactsContainerProps) => {
    const {
        contactsStore: { cleanup },
    } = useContactsStore();

    useEffect(() => cleanup, []);

    return (
        <>
            <div className="max-h-full w-full h-full grid grid-rows-2 gap-2">
                <EmailsCard uuid={uuid} />
                <PhonesCard uuid={uuid} />
            </div>
            <DialogSwitcher />
        </>
    );
};

export default observer(ContactsContainer);
