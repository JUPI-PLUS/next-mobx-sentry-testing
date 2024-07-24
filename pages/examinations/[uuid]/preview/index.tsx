// libs
import React from "react";

// models
import { ExaminationResultsPermission } from "../../../../src/shared/models/permissions";

// components
import ExaminationPreviewModule from "../../../../src/modules/ExaminationPreview/ExaminationPreviewModule";
import PrintableLayout from "../../../../src/components/Layouts/PrintableLayout/PrintableLayout";
import PermissionAccessPage from "../../../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";

const ExaminationPreview = () => {
    return (
        <PrintableLayout title="Examination preview">
            <PermissionAccessPage required={[ExaminationResultsPermission.VIEW_LIST]}>
                <ExaminationPreviewModule />
            </PermissionAccessPage>
        </PrintableLayout>
    );
};

export default ExaminationPreview;
