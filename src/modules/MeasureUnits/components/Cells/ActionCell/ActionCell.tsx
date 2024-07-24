// libs
import React, { FC, useRef } from "react";
import { observer } from "mobx-react";

// components
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import Popper from "../../../../../components/uiKit/Popper/Popper";

// hooks
import { useDisclosure } from "../../../../../shared/hooks/useDisclosure";

// store
import { useMeasureUnitsStore } from "../../../store";

// models
import { ActionCellProps, MeasureUnitAction } from "../../../models";

const ActionCell: FC<ActionCellProps> = ({ row }) => {
    const {
        measureUnitsStore: { setupMeasureUnit, setupMeasureUnitAction },
    } = useMeasureUnitsStore();
    const iconRef = useRef(null);
    const { onOpen, isOpen, onClose } = useDisclosure();

    const onDropdownItemClick = (action: MeasureUnitAction) => () => {
        setupMeasureUnitAction(action);
        setupMeasureUnit(row.original);
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
                        onClick={onDropdownItemClick(MeasureUnitAction.EDIT)}
                        data-testid="edit-measure-unit"
                    >
                        Edit
                    </li>
                    <li
                        className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md"
                        onClick={onDropdownItemClick(MeasureUnitAction.DELETE)}
                        data-testid="delete-measure-unit"
                    >
                        Delete
                    </li>
                </ul>
            </Popper>
        </>
    );
};

export default observer(ActionCell);
