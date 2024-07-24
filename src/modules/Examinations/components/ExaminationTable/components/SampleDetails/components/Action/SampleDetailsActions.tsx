//  libs
import React, { useMemo, useRef } from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { observer } from "mobx-react";

//  stores
import { useExaminationStore } from "../../../../../../store";

//  helpers
import { useDisclosure } from "../../../../../../../../shared/hooks/useDisclosure";

//  models
import { SampleActionType } from "../../../../../../../../shared/models/business/sample";
import { SampleStatuses } from "../../../../../../../../shared/models/business/enums";

//  components
import Popper from "../../../../../../../../components/uiKit/Popper/Popper";
import SampleActionsDrawers from "./components/SampleActionsDrawers";
import ActionOptions from "./components/ActionOptions";
import { IconButton } from "../../../../../../../../components/uiKit/Button/Button";

const SampleDetailsActions = () => {
    const iconRef = useRef(null);

    const {
        examinationStore: { activeSample, availableMarkAsDamageExamsStatuses, setupSampleActionType },
    } = useExaminationStore();

    const { isOpen, onOpen, onClose } = useDisclosure();

    const isSampleDamaged = activeSample?.sample_statuses_id === SampleStatuses.DAMAGED;

    const isMarkAsDamagedItemVisible = useMemo(() => {
        if (isSampleDamaged) return false;

        return availableMarkAsDamageExamsStatuses.length > 0;
    }, [availableMarkAsDamageExamsStatuses, isSampleDamaged]);

    const onItemClick = (type: SampleActionType) => {
        onClose();
        setupSampleActionType(type);
    };

    return (
        <>
            <IconButton
                ref={iconRef}
                aria-label="Sample actions"
                size="thin"
                variant="transparent"
                className="flex h-10 w-10 items-center justify-center border border-dark-400 rounded-md"
                onClick={onOpen}
                data-testid="sample-actions-button"
            >
                <EllipsisHorizontalIcon className="w-6 h-6" />
            </IconButton>
            <Popper isOpen={isOpen} sourceRef={iconRef} onClose={onClose} placement="bottom-end">
                <ActionOptions
                    onItemClick={onItemClick}
                    isMarkAsDamagedItemVisible={isMarkAsDamagedItemVisible}
                    sampleUUID={activeSample?.uuid}
                />
            </Popper>
            <SampleActionsDrawers />
        </>
    );
};

export default observer(SampleDetailsActions);
