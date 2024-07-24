import React from "react";
import OrdersModule from "../../src/modules/Orders/OrdersModule";
import PrivateLayout from "../../src/components/Layouts/PrivateLayout/PrivateLayout";
import PermissionAccessPage from "../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import { OrdersPermission } from "../../src/shared/models/permissions";

const Orders = () => {
    return (
        <PrivateLayout title="Orders" thin>
            <PermissionAccessPage
                required={[OrdersPermission.VIEW_LIST, OrdersPermission.VIEW_LIST_SELF_CREATED]}
                tolerant
            >
                <OrdersModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default Orders;
