import React from "react";
import PatientProfileModule from "../../src/modules/PatientProfile/PatientProfileModule";
import PrivateLayout from "../../src/components/Layouts/PrivateLayout/PrivateLayout";
import PermissionAccessPage from "../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import { ProfilePermission } from "../../src/shared/models/permissions";

const PatientProfilePage = () => {
    return (
        <PrivateLayout title="Patient profile" thin>
            <PermissionAccessPage required={[ProfilePermission.VIEW_ONE]}>
                <PatientProfileModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default PatientProfilePage;
