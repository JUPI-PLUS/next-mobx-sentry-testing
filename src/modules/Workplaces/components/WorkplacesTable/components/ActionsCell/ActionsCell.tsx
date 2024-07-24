// libs
import React, { useRef } from "react";
import { useRouter } from "next/router";

// helpers
import { useDisclosure } from "../../../../../../shared/hooks/useDisclosure";

// models
import { ActionsCellProps } from "./models";

// constants
import { ROUTES } from "../../../../../../shared/constants/routes";

// components
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import Popper from "../../../../../../components/uiKit/Popper/Popper";

const ActionsCell = ({ row, onDeleteWorkplace }: ActionsCellProps) => {
    const iconRef = useRef(null);

    const { push } = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onEditClick = () => {
        push({ pathname: ROUTES.workplaces.edit.route, query: { uuid: row.uuid } });
        onClose();
    };

    const onDeleteClick = () => {
        onDeleteWorkplace();
        onClose();
    };

    return (
        <>
            <div className="flex h-full w-full items-center justify-center">
                <EllipsisHorizontalIcon
                    ref={iconRef}
                    className="w-6 h-6 cursor-pointer fill-dark-700"
                    onClick={onOpen}
                    data-testid="action-button"
                />
            </div>
            <Popper isOpen={isOpen} sourceRef={iconRef} onClose={onClose} placement="bottom-end">
                <ul className="bg-white shadow-dropdown py-3 rounded-md">
                    <li
                        className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md"
                        onClick={onEditClick}
                        data-testid="edit-workplace"
                    >
                        Edit
                    </li>
                    <li
                        className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md"
                        onClick={onDeleteClick}
                        data-testid="delete-workplace"
                    >
                        Delete
                    </li>
                </ul>
            </Popper>
        </>
    );
};

export default ActionsCell;
