import React, { FC, useMemo } from "react";
import { OrderExaminationRow, OrderExaminationRowTypeEnum, OrderExaminationTableRow } from "../../../models";
import { ExamStatusesEnum } from "../../../../../../../shared/models/business/exam";
import Badge from "../../../../../../../components/uiKit/Badge/Badge";
import { Row } from "@tanstack/react-table";

interface StatusCellProps {
    row: Row<OrderExaminationTableRow>;
}

const StatusCell: FC<StatusCellProps> = ({ row }) => {
    const badgeVariant = useMemo(() => {
        if (row.original?.type === OrderExaminationRowTypeEnum.GROUP) {
            return undefined;
        }

        switch ((row.original as OrderExaminationRow).exam_status) {
            case ExamStatusesEnum.BIOMATERIAL_RECEIVED:
                return "info";
            case ExamStatusesEnum.DONE:
                return "success";
            case ExamStatusesEnum.FAILED:
                return "error";
            case ExamStatusesEnum.NEW:
                return "neutral";
            case ExamStatusesEnum.IN_PROGRESS:
            default:
                return "warning";
        }
    }, []);

    if (row.original?.type === OrderExaminationRowTypeEnum.GROUP) {
        return null;
    }

    return <Badge text={row.original.exam_status_text} variant={badgeVariant} id={`badge-${row.original.exam_uuid}`} />;
};

export default StatusCell;
