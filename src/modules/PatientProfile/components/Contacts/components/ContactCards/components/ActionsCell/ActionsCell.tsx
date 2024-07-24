// libs
import React, { useRef } from "react";
import { observer } from "mobx-react";

// stores
import { useContactsStore } from "../../../../store";

// helpers
import { useDisclosure } from "../../../../../../../../shared/hooks/useDisclosure";

// models
import { ActionsCellProps } from "./models";
import { ContactActionsEnum } from "../../../../models";

// constants
import { CONTACT_TYPES } from "../../../../constants";

// components
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import Popper from "../../../../../../../../components/uiKit/Popper/Popper";

const ActionsCell = ({ contact, type }: ActionsCellProps) => {
    const { uuid, is_primary: isPrimary } = contact;

    const iconRef = useRef(null);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        contactsStore: { setupActionType, setSelectedContact },
    } = useContactsStore();

    const onEditClick = () => {
        setSelectedContact(contact);
        setupActionType(type === CONTACT_TYPES.EMAIL ? ContactActionsEnum.EDIT_EMAIL : ContactActionsEnum.EDIT_PHONE);
        onClose();
    };

    const onDeleteClick = () => {
        setSelectedContact(contact);
        setupActionType(
            type === CONTACT_TYPES.EMAIL ? ContactActionsEnum.DELETE_EMAIL : ContactActionsEnum.DELETE_PHONE
        );
        onClose();
    };

    return (
        <>
            <div className="flex h-full w-full items-center justify-center">
                <EllipsisHorizontalIcon
                    ref={iconRef}
                    className="w-6 h-6 cursor-pointer fill-dark-700"
                    onClick={onOpen}
                    data-testid={`action-button-contact-${uuid}`}
                />
            </div>
            <Popper isOpen={isOpen} sourceRef={iconRef} onClose={onClose} placement="bottom-end">
                <ul className="bg-white shadow-dropdown py-3 rounded-md">
                    <li
                        className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md"
                        onClick={onEditClick}
                        data-testid="edit-contact"
                    >
                        Edit
                    </li>
                    {!isPrimary && (
                        <li
                            className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md"
                            onClick={onDeleteClick}
                            data-testid="delete-contact"
                        >
                            Delete
                        </li>
                    )}
                </ul>
            </Popper>
        </>
    );
};

export default observer(ActionsCell);
