// libs
import React, { FC, useRef } from "react";
import { observer } from "mobx-react";

// components
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import Popper from "../../../../../components/uiKit/Popper/Popper";

// hooks
import { useDisclosure } from "../../../../../shared/hooks/useDisclosure";

// store
import { useParameterOptionsStore } from "../../../store";

// models
import { OptionAction } from "../../../models";
import { ActionCellProps } from "./models";

const ActionCell: FC<ActionCellProps> = ({ row }) => {
    const {
        parameterOptionsStore: { setupOption, setupOptionAction },
    } = useParameterOptionsStore();
    const iconRef = useRef(null);
    const { onOpen, isOpen, onClose } = useDisclosure();

    const onDropdownItemClick = (action: OptionAction) => () => {
        setupOptionAction(action);
        setupOption(row.original);
        onClose();
    };

    return (
        <>
            <div className="h-full">
                <div className="flex h-full w-full items-center justify-center">
                    <EllipsisHorizontalIcon
                        ref={iconRef}
                        className="w-6 h-6 cursor-pointer fill-dark-700"
                        onClick={onOpen}
                        data-testid="action-button"
                    />
                </div>
            </div>
            <Popper isOpen={isOpen} sourceRef={iconRef} onClose={onClose} placement="bottom-end">
                <ul className="bg-white shadow-dropdown py-3 rounded-md">
                    <li
                        className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md"
                        onClick={onDropdownItemClick(OptionAction.EDIT)}
                        data-testid="edit-option"
                    >
                        Edit
                    </li>
                    <li
                        className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md"
                        onClick={onDropdownItemClick(OptionAction.DELETE)}
                        data-testid="delete-option"
                    >
                        Delete
                    </li>
                </ul>
            </Popper>
        </>
    );
};

export default observer(ActionCell);
