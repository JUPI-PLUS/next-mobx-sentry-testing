// libs
import React from "react";

// models
import { AdministratorPermission } from "../../../../src/shared/models/permissions";

// components
import PrivateLayout from "../../../../src/components/Layouts/PrivateLayout/PrivateLayout";
import PermissionAccessPage from "../../../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import WorkplaceModule from "../../../../src/modules/Workplace/WorkplaceModule";

const EditWorkplace = () => {
    return (
        <PrivateLayout title="Edit workplace" thin>
            <PermissionAccessPage required={[AdministratorPermission.WORKPLACES]}>
                <WorkplaceModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default EditWorkplace;
