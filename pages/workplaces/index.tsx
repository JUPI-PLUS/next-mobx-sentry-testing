// libs
import React from "react";

// models
import { AdministratorPermission } from "../../src/shared/models/permissions";

// components
import PrivateLayout from "../../src/components/Layouts/PrivateLayout/PrivateLayout";
import PermissionAccessPage from "../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import WorkplacesModule from "../../src/modules/Workplaces/WorkplacesModule";

const Workplaces = () => {
    return (
        <PrivateLayout title="Workplaces" thin>
            <PermissionAccessPage required={[AdministratorPermission.WORKPLACES]}>
                <WorkplacesModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default Workplaces;
