// libs
import React from "react";

// models
import { OrderItemProps } from "./models";

// components
import ExamItem from "../ExamItem/ExamItem";
import ExpandableNotes from "../Notes/ExpandableNotes/ExpandableNotes";

const OrderItem = ({ order, orderIndex }: OrderItemProps) => {
    return (
        <div>
            <div className="mb-4">
                <p className="text-lg font-bold">Order №{order.order_number}</p>
                <ExpandableNotes notes={order.order_notes} className="w-full mt-2" />
            </div>
            {Boolean(order.exams.length) && (
                <div className="flex flex-col gap-4">
                    {order.exams.map((exam, index) => (
                        <ExamItem
                            key={`${order.order_uuid}-${exam.uuid}`}
                            exam={exam}
                            path={`${orderIndex}.exams.${index}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderItem;
