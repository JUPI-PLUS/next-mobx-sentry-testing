// libs
import React, { useEffect } from "react";
import { observer } from "mobx-react";

// stores
import { useExaminationStore } from "../../../../store";

// helpers
import useWindowResize from "../../../../../../shared/hooks/useWindowResize";

// models
import { OrderListProps } from "./models";

// components
import OrderItem from "./OrderItem";

const OrderList = ({ orders }: OrderListProps) => {
    const { isResizing } = useWindowResize();

    const {
        examinationStore: { setIsWindowResizing },
    } = useExaminationStore();

    useEffect(() => {
        setIsWindowResizing(isResizing);
    }, [isResizing]);

    const areExamsExist = Boolean(orders.length);

    if (!areExamsExist)
        return (
            <div className="w-full h-full flex items-center justify-center ">
                <p className="text-xl font-bold">There is no data</p>
            </div>
        );

    return (
        <div className="py-5 overflow-hidden flex flex-col gap-6">
            {orders.map((order, index) => (
                <OrderItem key={order.order_uuid} order={order} orderIndex={index} />
            ))}
        </div>
    );
};

export default observer(OrderList);
