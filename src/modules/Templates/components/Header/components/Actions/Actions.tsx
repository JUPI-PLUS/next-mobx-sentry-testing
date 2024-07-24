// libs
import React, { useRef } from "react";
import { observer } from "mobx-react";
import { useRouter } from "next/router";

// helpers
import { useDisclosure } from "../../../../../../shared/hooks/useDisclosure";

// constants
import { ROUTES } from "../../../../../../shared/constants/routes";

// stores
import { useTemplatesStore } from "../../../../store";

// constants
import { MAX_GROUP_NEST_LVL } from "../../../../../../shared/constants/templates";

// models
import { DialogTypeEnum } from "../../../../models";

// components
import { SolidButton } from "../../../../../../components/uiKit/Button/Button";
import Popper from "../../../../../../components/uiKit/Popper/Popper";

const Actions = () => {
    const buttonRef = useRef(null);

    const {
        templatesStore: { nestedLvl, setDialogType },
    } = useTemplatesStore();

    const { push } = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onCreateGroupClick = () => {
        onClose();
        setDialogType(DialogTypeEnum.ADD);
    };

    const onCreateKitClick = () => {
        onClose();
        push(ROUTES.createKitTemplate.route);
    };

    const onCreateExamClick = () => {
        onClose();
        push(ROUTES.examTemplate.create.route);
    };

    return (
        <>
            <div className="h-full">
                <div className="flex h-full w-full items-center justify-center">
                    <SolidButton
                        ref={buttonRef}
                        type="button"
                        text="Create"
                        onClick={onOpen}
                        size="sm"
                        data-testid="create-action-button"
                    />
                </div>
            </div>
            <Popper isOpen={isOpen} sourceRef={buttonRef} onClose={onClose} placement="bottom-end" offsetDistance={8}>
                <ul className="bg-white shadow-dropdown py-3 rounded-md">
                    {nestedLvl < MAX_GROUP_NEST_LVL && (
                        <li
                            className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md"
                            onClick={onCreateGroupClick}
                            data-testid="create-group-action"
                        >
                            Create group
                        </li>
                    )}
                    <li
                        className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md"
                        data-testid="create-kit-action"
                        onClick={onCreateKitClick}
                    >
                        Create kit
                    </li>
                    <li
                        className="py-2 px-5 cursor-pointer hover:bg-gray-300 text-md"
                        data-testid="create-exam-action"
                        onClick={onCreateExamClick}
                    >
                        Create exam
                    </li>
                </ul>
            </Popper>
        </>
    );
};

export default observer(Actions);
