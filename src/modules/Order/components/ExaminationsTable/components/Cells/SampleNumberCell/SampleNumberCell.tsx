import React, { FC } from "react";
import { OrderExaminationRowTypeEnum, OrderExaminationTableRow } from "../../../models";
import { Row } from "@tanstack/react-table";
import SampleDropdown from "./components/SampleDropdown/SampleDropdown";
import { SampleStatuses } from "../../../../../../../shared/models/business/enums";

interface SampleNumberCellProps {
    row: Row<OrderExaminationTableRow>;
    userUUID: string;
}

const SampleNumberCell: FC<SampleNumberCellProps> = ({ row, userUUID }) => {
    if (row.original.type === OrderExaminationRowTypeEnum.GROUP) {
        return null;
    }

    const isSampleDamaged = row.original.sample_statuses_id === SampleStatuses.DAMAGED;

    return row.original.sample_num ? (
        <SampleDropdown userUUID={userUUID} exam={row.original} isSampleDamaged={isSampleDamaged}>
            <span className="font-medium">
                {row.original.sample_num} {isSampleDamaged && "(damaged)"}
            </span>
        </SampleDropdown>
    ) : (
        <span className="font-medium">No data</span>
    );
};

export default SampleNumberCell;
