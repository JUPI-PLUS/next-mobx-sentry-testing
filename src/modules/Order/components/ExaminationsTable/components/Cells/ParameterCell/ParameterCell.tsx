import React, { FC } from "react";
import { OrderExaminationRowTypeEnum, OrderExaminationTableRow } from "../../../models";
import { Row } from "@tanstack/react-table";
import ExamGroupCheckbox from "./components/Checkboxes/ExamGroupCheckbox";
import ExamCheckbox from "./components/Checkboxes/ExamCheckbox";
import PermissionAccessElement from "../../../../../../../components/UserAccess/PermissionAccess/PermissionAccessElement";
import { SamplingPermission } from "../../../../../../../shared/models/permissions";

interface ParameterCellProps {
    row: Row<OrderExaminationTableRow>;
}

const ParameterCell: FC<ParameterCellProps> = ({ row }) => {
    if (row.original.type === OrderExaminationRowTypeEnum.GROUP) {
        return (
            <div className="flex items-center">
                <PermissionAccessElement required={[SamplingPermission.SAMPLING_ACTIONS]}>
                    <ExamGroupCheckbox exams={row.original.exams} />
                </PermissionAccessElement>
                <span className="text-md font-bold ml-3" data-testid={row.original.sampleName}>
                    {row.original.sampleName}
                </span>
            </div>
        );
    }

    return (
        <div className="flex items-center">
            <PermissionAccessElement required={[SamplingPermission.SAMPLING_ACTIONS]}>
                <ExamCheckbox exam={row.original} />
            </PermissionAccessElement>
            <span className="text-md ml-3" data-testid={row.original.exam_name}>
                {row.original.exam_name}
            </span>
        </div>
    );
};

export default ParameterCell;
