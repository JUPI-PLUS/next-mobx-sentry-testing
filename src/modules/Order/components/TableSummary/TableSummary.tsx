import React, { FC } from "react";
import { SampleActionType } from "../../../../shared/models/business/sample";
import { SolidButton } from "../../../../components/uiKit/Button/Button";
import { useOrderStore } from "../../store";
import { observer } from "mobx-react";
import PermissionAccessElement from "../../../../components/UserAccess/PermissionAccess/PermissionAccessElement";
import { SamplingPermission } from "../../../../shared/models/permissions";

interface TableSummaryProps {
    onDrawerOpen: () => void;
}

const TableSummary: FC<TableSummaryProps> = ({ onDrawerOpen }) => {
    const {
        orderStore: { selectedExams, isSingleItemAction, setupSampleActionType },
    } = useOrderStore();

    const isSelectedExamHasSampleNumber = Array.from(selectedExams).some(([, exam]) => Boolean(exam.sample_num));

    const onRemoveSampleClick = () => {
        setupSampleActionType(SampleActionType.DetachExams);
    };

    if (!selectedExams.size || isSingleItemAction) return null;

    return (
        <div className="w-full border-t bg-white flex items-center justify-between p-6">
            <div className="text-md">{selectedExams.size} exams selected</div>
            <div className="flex items-center justify-end leading-none h-full">
                <PermissionAccessElement required={[SamplingPermission.SAMPLING_ACTIONS]}>
                    <>
                        {isSelectedExamHasSampleNumber && (
                            <SolidButton
                                text="Remove sample from Exams"
                                size="sm"
                                className="mr-2"
                                onClick={onRemoveSampleClick}
                                data-testid="sample-remove-item"
                            />
                        )}
                    </>
                </PermissionAccessElement>
                <PermissionAccessElement required={[SamplingPermission.SAMPLING_ACTIONS]}>
                    <SolidButton
                        text={isSelectedExamHasSampleNumber ? "Resample" : "Add sample"}
                        size="sm"
                        onClick={onDrawerOpen}
                        data-testid="add-sample-item"
                    />
                </PermissionAccessElement>
            </div>
        </div>
    );
};

export default observer(TableSummary);
