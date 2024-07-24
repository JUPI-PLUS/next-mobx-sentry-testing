// libs
import React from "react";

// components
import PrivateLayout from "../../src/components/Layouts/PrivateLayout/PrivateLayout";
import ParametersModule from "../../src/modules/Parameters/ParametersModule";
import PermissionAccessPage from "../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import { ExaminationsPermission } from "../../src/shared/models/permissions";

const Parameters = () => {
    return (
        <PrivateLayout title="Parameters" thin>
            <PermissionAccessPage required={[ExaminationsPermission.CONSTRUCTOR]}>
                <ParametersModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default Parameters;
