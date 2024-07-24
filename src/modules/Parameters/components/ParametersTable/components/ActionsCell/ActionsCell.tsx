// libs
import React, { FC, useRef } from "react";

// helpers
import { useDisclosure } from "../../../../../../shared/hooks/useDisclosure";

// models
import { ActionsCellProps } from "./models";

// components
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import Popper from "../../../../../../components/uiKit/Popper/Popper";
import { observer } from "mobx-react";
import { ParameterActionsEnum, useParametersStore } from "../../../../store";

const ActionsCell: FC<ActionsCellProps> = ({ row }) => {
    const {
        parametersStore: { setupParameterAction, setupSelectedParameter },
    } = useParametersStore();
    const iconRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onEditClick = () => {
        setupSelectedParameter(row);
        setupParameterAction(ParameterActionsEnum.EDIT);
        onClose();
    };

    const onDeleteClick = () => {
        setupSelectedParameter(row);
        setupParameterAction(ParameterActionsEnum.DELETE);
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
                        data-testid="edit-option"
                    >
                        Edit
                    </li>
                    <li
                        className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md"
                        onClick={onDeleteClick}
                        data-testid="delete-option"
                    >
                        Delete
                    </li>
                </ul>
            </Popper>
        </>
    );
};

export default observer(ActionsCell);
