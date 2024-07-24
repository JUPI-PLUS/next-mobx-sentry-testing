import PrivateLayout from "../../src/components/Layouts/PrivateLayout/PrivateLayout";
import PermissionAccessPage from "../../src/components/UserAccess/PermissionAccess/PermissionAccessPage";
import PermissionsModule from "../../src/modules/PermissionsModule/PermissionsModule";
import { AdministratorPermission } from "../../src/shared/models/permissions";

const Permissions = () => {
    return (
        <PrivateLayout title="Permissions" thin>
            <PermissionAccessPage required={[AdministratorPermission.ROLE_ACTIONS]}>
                <PermissionsModule />
            </PermissionAccessPage>
        </PrivateLayout>
    );
};

export default Permissions;
