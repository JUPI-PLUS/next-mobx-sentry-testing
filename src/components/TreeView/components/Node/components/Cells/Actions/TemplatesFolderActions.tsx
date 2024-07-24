// libs
import React, { FC, useRef } from "react";
import { observer } from "mobx-react";

// models
import { FolderActionsProps } from "../../../../../models";

// constants
import { MAX_GROUP_NEST_LVL } from "../../../../../../../shared/constants/templates";

// components
import Popper from "../../../../../../uiKit/Popper/Popper";
import CirclePlusIcon from "../../../../../../uiKit/Icons/CirclePlusIcon";

const TemplatesFolderActions: FC<FolderActionsProps> = ({
    isOpen,
    nestedLvl,
    onOpen,
    onClose,
    onClickAddGroup,
    onClickAddExam,
    onClickAddKit,
}) => {
    const iconRef = useRef(null);
    const isAddGroupAvailable = nestedLvl < MAX_GROUP_NEST_LVL;

    return (
        <>
            <div ref={iconRef} onClick={onOpen}>
                <CirclePlusIcon
                    className={`${isOpen ? "fill-dark-900" : "fill-dark-700 hover:fill-dark-900"} cursor-pointer`}
                    data-testid="template-add-actions-icon"
                />
            </div>
            <Popper isOpen={isOpen} sourceRef={iconRef} onClose={onClose} placement="bottom-end" offsetDistance={8}>
                <ul className="bg-white shadow-dropdown py-3 rounded-md">
                    {isAddGroupAvailable && (
                        <li
                            className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md"
                            onClick={onClickAddGroup}
                            data-testid="template-add-group"
                        >
                            Add group
                        </li>
                    )}
                    <li className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md" onClick={onClickAddKit}>
                        Add kit
                    </li>
                    <li className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md" onClick={onClickAddExam}>
                        Add exam
                    </li>
                </ul>
            </Popper>
        </>
    );
};

export default observer(TemplatesFolderActions);
