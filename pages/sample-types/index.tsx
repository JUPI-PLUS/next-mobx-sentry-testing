// libs
import React from "react";

// components
import PrivateLayout from "../../src/components/Layouts/PrivateLayout/PrivateLayout";
import PermissionAccessPage from "../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import { ExaminationsPermission } from "../../src/shared/models/permissions";
import SampleTypesModule from "../../src/modules/SampleTypes/SampleTypesModule";

const SampleTypes = () => {
    return (
        <PrivateLayout title="Sample types" thin>
            <PermissionAccessPage required={[ExaminationsPermission.CONSTRUCTOR]}>
                <SampleTypesModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default SampleTypes;
