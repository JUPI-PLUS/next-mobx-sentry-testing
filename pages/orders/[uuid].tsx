import React from "react";
import PrivateLayout from "../../src/components/Layouts/PrivateLayout/PrivateLayout";
import OrderModule from "../../src/modules/Order/OrderModule";
import PermissionAccessPage from "../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import { OrdersPermission } from "../../src/shared/models/permissions";

const Order = () => {
    return (
        <PrivateLayout title="Orders" thin>
            <PermissionAccessPage
                required={[OrdersPermission.VIEW_ONE, OrdersPermission.VIEW_ONE_SELF_CREATED]}
                tolerant
            >
                <OrderModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default Order;
