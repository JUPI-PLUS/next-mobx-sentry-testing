// libs
import React, { FC, useMemo } from "react";

// helpers
import { openInNewTab } from "../../../../../../../../../shared/utils/events";
import { nextJSUrlToString } from "../../../../../../../../../shared/utils/routing";

// models
import { SampleDropdownContentProps } from "./models";
import { ExamStatusesEnum } from "../../../../../../../../../shared/models/business/exam";
import { SampleActionType } from "../../../../../../../../../shared/models/business/sample";

// constants
import { ROUTES } from "../../../../../../../../../shared/constants/routes";

const SampleDropdownContent: FC<SampleDropdownContentProps> = ({
    userUUID,
    isSomeExamOnValidation,
    exam,
    isSampleDamaged,
    onItemClick,
    onClose,
}) => {
    const isExamDone = useMemo(() => exam.exam_status === ExamStatusesEnum.DONE, [exam.exam_status]);
    const isExamOnValidation = useMemo(() => exam.exam_status === ExamStatusesEnum.ON_VALIDATION, [exam.exam_status]);
    const isExamFailed = useMemo(() => exam.exam_status === ExamStatusesEnum.FAILED, [exam.exam_status]);

    const isMarkAsDamagedItemVisible = useMemo(() => {
        if (isExamFailed || isExamDone || isExamOnValidation || isSomeExamOnValidation) return false;
        return !isSampleDamaged;
    }, [isExamFailed, isExamOnValidation, isExamDone, isSomeExamOnValidation, isSampleDamaged]);
    const isExamCanBeResampled = !isExamDone && !isExamOnValidation;
    const isExamSampleCanBeRemoved = !isExamDone && !isExamOnValidation;

    const onPrintBarcodeClick = () => {
        openInNewTab(
            nextJSUrlToString({
                pathname: ROUTES.printBarcode.route,
                query: { user_uuid: userUUID, sample_uuid: exam.sample_uuid },
            })
        );
        onClose();
    };

    return (
        <ul>
            <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                data-testid="sample-view-details-item"
                onClick={() => onItemClick(SampleActionType.Details)}
            >
                <p className="text-md font-semibold">View details</p>
            </li>
            {isExamCanBeResampled && (
                <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    data-testid="add-sample-item"
                    onClick={() => onItemClick(SampleActionType.Resample)}
                >
                    <p className="text-md font-semibold">Resample</p>
                </li>
            )}
            {isMarkAsDamagedItemVisible && (
                <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    data-testid="sample-mark-as-damaged-item"
                    onClick={() => onItemClick(SampleActionType.ChangeStatus)}
                >
                    <p className="text-md font-semibold">Mark as damaged</p>
                </li>
            )}
            {isExamSampleCanBeRemoved && (
                <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    data-testid="sample-remove-item"
                    onClick={() => onItemClick(SampleActionType.DetachExams)}
                >
                    <p className="text-md font-semibold">Remove</p>
                </li>
            )}
            {!isSampleDamaged && (
                <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    data-testid="sample-print-barcode-item"
                    onClick={onPrintBarcodeClick}
                >
                    <p className="text-md font-semibold">Print barcode</p>
                </li>
            )}
        </ul>
    );
};

export default SampleDropdownContent;
