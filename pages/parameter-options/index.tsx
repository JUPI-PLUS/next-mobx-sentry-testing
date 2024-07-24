// libs
import React from "react";

// components
import PrivateLayout from "../../src/components/Layouts/PrivateLayout/PrivateLayout";
import ParameterOptionsModule from "../../src/modules/ParameterOptions/ParameterOptionsModule";
import PermissionAccessPage from "../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import { ExaminationsPermission } from "../../src/shared/models/permissions";

const ParameterOptions = () => {
    return (
        <PrivateLayout title="Parameter options" thin>
            <PermissionAccessPage required={[ExaminationsPermission.CONSTRUCTOR]}>
                <ParameterOptionsModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default ParameterOptions;
