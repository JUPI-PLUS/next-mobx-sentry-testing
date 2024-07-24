// libs
import React from "react";

// components
import PrivateLayout from "../../src/components/Layouts/PrivateLayout/PrivateLayout";
import PermissionAccessPage from "../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import { ExaminationsPermission } from "../../src/shared/models/permissions";
import MeasureUnitsModule from "../../src/modules/MeasureUnits/MeasureUnitsModule";

const MeasureUnits = () => {
    return (
        <PrivateLayout title="Measure units" thin>
            <PermissionAccessPage required={[ExaminationsPermission.CONSTRUCTOR]}>
                <MeasureUnitsModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default MeasureUnits;
