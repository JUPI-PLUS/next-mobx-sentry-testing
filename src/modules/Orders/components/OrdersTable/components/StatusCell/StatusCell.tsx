// libs
import React, { FC } from "react";

// models
import { StatusCellProps } from "./models";
import { OrderStatus } from "../../../../../../shared/models/business/order";
import { TableStatusVariant } from "../../../../../../components/uiKit/Statuses/TableStatus/models";

// components
import TableStatus from "../../../../../../components/uiKit/Statuses/TableStatus/TableStatus";

const StatusCell: FC<StatusCellProps> = ({ status, text }) => {
    let statusVariant: TableStatusVariant;

    switch (status) {
        case OrderStatus.BIOMATERIALS_RECEIVED:
            statusVariant = "primary";
            break;
        case OrderStatus.DONE:
            statusVariant = "success";
            break;
        case OrderStatus.FAILED:
            statusVariant = "error";
            break;
        case OrderStatus.PRE_ORDER:
        case OrderStatus.IN_PROGRESS:
            statusVariant = "warning";
            break;
        case OrderStatus.NEW:
            statusVariant = "neutral";
            break;
        default:
            statusVariant = "neutral";
    }

    return (
        <div className="h-full flex items-center">
            <TableStatus variant={statusVariant} text={text} />
        </div>
    );
};

export default StatusCell;
