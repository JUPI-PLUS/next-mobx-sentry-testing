import PrivateLayout from "../../../../src/components/Layouts/PrivateLayout/PrivateLayout";
import KitTemplateModule from "../../../../src/modules/KitTemplate/KitTemplateModule";
import PermissionAccessPage from "../../../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import { ExaminationsPermission } from "../../../../src/shared/models/permissions";

const CreateKitTemplate = () => {
    return (
        <PrivateLayout title="Create kit template" thin>
            <PermissionAccessPage required={[ExaminationsPermission.CONSTRUCTOR]}>
                <KitTemplateModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default CreateKitTemplate;
