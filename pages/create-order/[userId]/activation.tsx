// libs
import React from "react";

// models
import { OrdersPermission } from "../../../src/shared/models/permissions";

// components
import PrivateLayout from "../../../src/components/Layouts/PrivateLayout/PrivateLayout";
import PermissionAccessPage from "../../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import KitActivationModule from "../../../src/modules/KitActivation/KitActivationModule";

const KitActivation = () => {
    return (
        <PrivateLayout title="Kit activation" thin>
            <PermissionAccessPage required={[OrdersPermission.CREATE]}>
                <KitActivationModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default KitActivation;
