import React, { FC } from "react";
import { OrderExaminationRowTypeEnum, OrderExaminationTableRow } from "../../../models";
import { Row } from "@tanstack/react-table";

interface BiomaterialTypeCellProps {
    row: Row<OrderExaminationTableRow>;
}

const BiomaterialTypeCell: FC<BiomaterialTypeCellProps> = ({ row }) => {
    if (row.original.type === OrderExaminationRowTypeEnum.GROUP) {
        return null;
    }

    return <>{row.original.sampleName}</>;
};

export default BiomaterialTypeCell;
