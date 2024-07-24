import { XMarkIcon } from "@heroicons/react/24/outline";
import { observer } from "mobx-react";
import { IconButton, TextButton } from "../../../../../../components/uiKit/Button/Button";
import RoleIcon from "../../../../../../components/uiKit/Icons/RoleIcon";
import UsersListIcon from "../../../../../../components/uiKit/Icons/UsersListIcon";
import { usePermissionsStore } from "../../../../store";
import DeleteRoleDialog from "../../../dialogs/DeleteRoleDialog/DeleteRoleDialog";
import EditRoleDialog from "../../../dialogs/EditRoleDialog/EditRoleDialog";

const PermissionsTableHeader = () => {
    const {
        permissionsStore: { activeRole, resetActiveRole },
    } = usePermissionsStore();

    return (
        <>
            <div className="flex items-center justify-between px-6 mb-4">
                <div className="flex gap-x-4">
                    <div className="w-14 h-14 flex items-center justify-center bg-dark-300 rounded-full">
                        <RoleIcon />
                    </div>
                    <div className="flex items-center">
                        <h2 className="text-md font-bold mr-1">{activeRole?.name}</h2>
                        <EditRoleDialog />
                    </div>
                </div>
                <div className="flex gap-x-6">
                    <TextButton
                        variant="transparent"
                        size="thin"
                        text="List of users"
                        endIcon={<UsersListIcon className="w-6 h-6" />}
                    />
                    <DeleteRoleDialog />
                    <IconButton
                        aria-label="Close active role"
                        className="ring-1 ring-dark-600 ring-inset w-10 h-10 rounded-lg justify-center"
                        variant="transparent"
                        size="thin"
                        onClick={resetActiveRole}
                        data-testid="close-active-role"
                    >
                        <XMarkIcon className="w-4 h-4 text-dark-900 stroke-2" />
                    </IconButton>
                </div>
            </div>
            <div className="w-full border-t border-dark-400" />
        </>
    );
};

export default observer(PermissionsTableHeader);
