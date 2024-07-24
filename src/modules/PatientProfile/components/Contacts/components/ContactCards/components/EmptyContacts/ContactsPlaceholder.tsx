// libs
import React, { useMemo } from "react";

// models
import { ContactsPlaceholderProps } from "./models";

// constants
import { CONTACT_TYPES } from "../../../../constants";

// components
import EmailIcon from "../../../../../../../../components/uiKit/Icons/EmailIcon";
import PhoneIcon from "../../../../../../../../components/uiKit/Icons/PhoneIcon";
import { SolidButton } from "../../../../../../../../components/uiKit/Button/Button";

const ContactsPlaceholder = ({ type, onCreateContact }: ContactsPlaceholderProps) => {
    const icon = useMemo(() => {
        switch (type) {
            case CONTACT_TYPES.EMAIL:
                return <EmailIcon className="stroke-dark-800" />;
            case CONTACT_TYPES.PHONE:
                return <PhoneIcon className="stroke-dark-800" />;
            default:
                return null;
        }
    }, [type]);

    return (
        <div className="flex items-center justify-center h-full pb-10">
            <div className="flex flex-col items-center">
                <div className="h-14 w-14 bg-dark-300 rounded-full flex items-center justify-center mb-4">{icon}</div>
                <p className="text-md mb-6" data-testid="empty-placeholder-text">
                    {type === CONTACT_TYPES.EMAIL ? "No added emails" : "No added phones"}
                </p>
                <SolidButton
                    onClick={onCreateContact}
                    type="button"
                    size="sm"
                    data-testid="empty-placeholder-add-contact-button"
                    variant="primary"
                    text={type === CONTACT_TYPES.EMAIL ? "Add email" : "Add phone"}
                />
            </div>
        </div>
    );
};

export default ContactsPlaceholder;
