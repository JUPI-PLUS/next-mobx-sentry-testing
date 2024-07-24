import PrivateLayout from "../../../../../src/components/Layouts/PrivateLayout/PrivateLayout";
import PermissionAccessPage from "../../../../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import KitTemplateModule from "../../../../../src/modules/KitTemplate/KitTemplateModule";
import { ExaminationsPermission } from "../../../../../src/shared/models/permissions";

const EditKitTemplate = () => {
    return (
        <PrivateLayout title="Edit kit template" thin>
            <PermissionAccessPage required={[ExaminationsPermission.CONSTRUCTOR]}>
                <KitTemplateModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default EditKitTemplate;
