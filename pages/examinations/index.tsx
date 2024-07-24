import React from "react";
import PrivateLayout from "../../src/components/Layouts/PrivateLayout/PrivateLayout";
import PermissionAccessPage from "../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import ExaminationsModule from "../../src/modules/Examinations/ExaminationsModule";
import { ExaminationResultsPermission } from "../../src/shared/models/permissions";

const Examinations = () => {
    return (
        <PrivateLayout title="Examinations" thin>
            <PermissionAccessPage required={[ExaminationResultsPermission.VIEW_LIST]}>
                <ExaminationsModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default Examinations;
