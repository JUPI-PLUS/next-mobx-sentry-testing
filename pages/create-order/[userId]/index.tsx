// libs
import React from "react";

// models
import { OrdersPermission } from "../../../src/shared/models/permissions";

// components
import PrivateLayout from "../../../src/components/Layouts/PrivateLayout/PrivateLayout";
import CreateOrderModule from "../../../src/modules/CreateOrder/CreateOrderModule";
import PermissionAccessPage from "../../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";

const CreateOrder = () => {
    return (
        <PrivateLayout title="Create order" thin>
            <PermissionAccessPage required={[OrdersPermission.CREATE]}>
                <CreateOrderModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default CreateOrder;
