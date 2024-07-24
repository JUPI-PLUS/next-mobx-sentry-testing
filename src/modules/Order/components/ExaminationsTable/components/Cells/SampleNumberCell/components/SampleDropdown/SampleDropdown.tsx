import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { FC, useRef } from "react";
import { observer } from "mobx-react";
import Popper from "../../../../../../../../../components/uiKit/Popper/Popper";
import { useClickAway } from "../../../../../../../../../shared/hooks/useClickAway";
import { useDisclosure } from "../../../../../../../../../shared/hooks/useDisclosure";
import SampleDropdownContent from "./SampleDropdownContent";
import { SampleDropdownProps } from "./models";
import { SampleActionType } from "../../../../../../../../../shared/models/business/sample";
import { useOrderStore } from "../../../../../../../store";
import PermissionAccessElement from "../../../../../../../../../components/UserAccess/PermissionAccess/PermissionAccessElement";
import { SamplingPermission } from "../../../../../../../../../shared/models/permissions";

const SampleDropdown: FC<SampleDropdownProps> = ({ userUUID, exam, isSampleDamaged, children }) => {
    const popperRef = useRef(null);
    const expandableZoneRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const {
        orderStore: {
            isSomeExamOnValidation,
            setupSampleActionType,
            setupOrderExam,
            setupIsSingleItemAction,
            resetOrderExams,
        },
    } = useOrderStore();

    useClickAway(popperRef, onClose, expandableZoneRef);

    const onItemClick = (type: SampleActionType) => {
        onClose();
        resetOrderExams();
        setupIsSingleItemAction(true);
        setupSampleActionType(type);
        setupOrderExam(exam);
    };

    const onOpenClick = () => {
        onOpen();
    };

    return (
        <div className="relative">
            <PermissionAccessElement required={[SamplingPermission.SAMPLING_ACTIONS]}>
                <Popper
                    closeOnClickOnSource={false}
                    offsetDistance={5}
                    offsetSkidding={-5}
                    placement="bottom-end"
                    isOpen={isOpen}
                    onClose={onClose}
                    sourceRef={expandableZoneRef}
                >
                    <div
                        className="py-3 min-w-52 bg-white shadow-dropdown rounded-md"
                        data-testid="dropdown-container"
                        ref={popperRef}
                    >
                        <SampleDropdownContent
                            userUUID={userUUID}
                            onItemClick={onItemClick}
                            onClose={onClose}
                            exam={exam}
                            isSampleDamaged={isSampleDamaged}
                            isSomeExamOnValidation={isSomeExamOnValidation}
                        />
                    </div>
                </Popper>
            </PermissionAccessElement>
            <div
                {...(exam.sample_uuid && { ref: expandableZoneRef, onClick: onOpenClick })}
                className="inline-flex items-center cursor-pointer"
                data-testid={`dropdown-field-${exam.exam_uuid}`}
            >
                {children}
                <PermissionAccessElement required={[SamplingPermission.SAMPLING_ACTIONS]}>
                    <>
                        {exam.sample_uuid && (
                            <div className="w-6 h-6">
                                <ChevronDownIcon />
                            </div>
                        )}
                    </>
                </PermissionAccessElement>
            </div>
        </div>
    );
};

export default observer(SampleDropdown);
