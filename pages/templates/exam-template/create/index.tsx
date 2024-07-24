// libs
import React from "react";

// components
import PrivateLayout from "../../../../src/components/Layouts/PrivateLayout/PrivateLayout";
import ExamTemplateModule from "../../../../src/modules/ExamTemplate/ExamTemplateModule";
import PermissionAccessPage from "../../../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import { ExaminationsPermission } from "../../../../src/shared/models/permissions";

const CreateExamTemplate = () => {
    return (
        <PrivateLayout title="Create exam template" thin>
            <PermissionAccessPage required={[ExaminationsPermission.CONSTRUCTOR]}>
                <ExamTemplateModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default CreateExamTemplate;
