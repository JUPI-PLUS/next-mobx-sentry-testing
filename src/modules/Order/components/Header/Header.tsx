import React, { FC, useMemo } from "react";
import Breadcrumbs from "../../../../components/uiKit/Breadcrumbs/Breadcrumbs";
import { OrderStatus } from "../../../../shared/models/business/order";
import Badge from "../../../../components/uiKit/Badge/Badge";
import { BadgeProps } from "../../../../components/uiKit/Badge/models";
import { useOrderStore } from "../../store";
import { observer } from "mobx-react";

interface HeaderProps {
    isFetching: boolean;
}

const Header: FC<HeaderProps> = ({ isFetching = true }) => {
    const {
        orderStore: { orderDetails },
    } = useOrderStore();

    const badgeProps = useMemo<BadgeProps>(() => {
        switch (orderDetails?.status) {
            case OrderStatus.IN_PROGRESS:
                return { text: "In progress", variant: "warning" };
            case OrderStatus.BIOMATERIALS_RECEIVED:
                return { text: "BiomaterialTypeCell received", variant: "info" };
            case OrderStatus.FAILED:
                return { text: "Failed", variant: "error" };
            case OrderStatus.DONE:
                return { text: "Done", variant: "success" };
            case OrderStatus.PRE_ORDER:
                return { text: "Preorder", variant: "neutral" };
            case OrderStatus.NEW:
                return { text: "New", variant: "neutral" };
            default:
                return { text: "", variant: "neutral" };
        }
    }, [orderDetails?.status]);

    if (isFetching) {
        return <div className="p-4 mt-1 bg-dark-300 w-60 rounded animate-pulse" />;
    }

    return (
        <div className="flex items-center w-full">
            <div className="mr-2">
                <Breadcrumbs label={`Order ${orderDetails?.order_number}`} />
            </div>
            <Badge {...badgeProps} id={`header-badge-${orderDetails?.status}`} />
        </div>
    );
};

export default observer(Header);
