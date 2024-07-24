// libs
import React, { FC } from "react";

// models
import { OrderNumberCellProps } from "./models";

// constants
import { ROUTES } from "../../../../../../shared/constants/routes";

// components
import LinkComponent from "../../../../../../components/uiKit/LinkComponent/LinkComponent";
import TextCell from "../../../../../../components/Table/components/TextCell/TextCell";

const OrderNumberCell: FC<OrderNumberCellProps> = ({ isLinkAllowed, orderNumber, orderUUID }) => {
    if (isLinkAllowed) {
        return (
            <LinkComponent
                href={{ pathname: ROUTES.orders.details.route, query: { uuid: orderUUID } }}
                aTagProps={{
                    className: "underline decoration-0.5 underline-offset-2 hover:no-underline",
                }}
                data-testid={`order-${orderNumber}-details-link`}
            >
                <TextCell text={orderNumber} />
            </LinkComponent>
        );
    }
    return <p>{orderNumber}</p>;
};

export default OrderNumberCell;
