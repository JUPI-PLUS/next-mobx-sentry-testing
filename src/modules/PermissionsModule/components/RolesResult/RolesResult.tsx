import { observer } from "mobx-react";
import { useQuery } from "react-query";
import { getRolesList } from "../../../../api/roles";
import { CircularProgressLoader } from "../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import { ROLES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { Role } from "../../../../shared/models/roles";
import { usePermissionsStore } from "../../store";
import RoleDetailsCard from "./components/RoleDetailsCard/RoleDetailsCard";
import Dialog from "../../../../components/uiKit/Dialog/Dialog";
import { useDisclosure } from "../../../../shared/hooks/useDisclosure";
import { useState } from "react";

const RolesResult = () => {
    const {
        permissionsStore: { rolesFilters, activeRole, setActiveRole, isPermissionsDirty, resetIsPermissionDirty },
    } = usePermissionsStore();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const [dirtyRole, setDirtyRole] = useState<Role | null>(null);

    const { data, isLoading } = useQuery(ROLES_QUERY_KEYS.LIST(rolesFilters), getRolesList(rolesFilters), {
        select: queryData => queryData.data.data,
    });

    const onCardClick = (role: Role) => () => {
        if (role.id === activeRole?.id) return;
        if (isPermissionsDirty) {
            onOpen();
            setDirtyRole(role);
            return;
        }
        setActiveRole(role);
    };

    const onConfirmLeave = () => {
        resetIsPermissionDirty();
        setActiveRole(dirtyRole!);
        setDirtyRole(null);
        onClose();
    };

    if (isLoading) return <CircularProgressLoader />;

    return (
        <>
            <h6 className="text-sm text-dark-800 text-center mb-3">Roles list</h6>
            <div className="overflow-auto shadow-card-shadow">
                <div className="max-h-full flex flex-col gap-y-2">
                    {data?.map(role => (
                        <RoleDetailsCard
                            key={`${role.id}-${role.name}`}
                            roleName={role.name}
                            isSelected={activeRole?.id === role.id}
                            onClick={onCardClick(role)}
                        />
                    ))}
                </div>
            </div>
            <Dialog
                title="Do you want to leave?"
                isOpen={isOpen}
                onClose={onClose}
                onCancel={onClose}
                onSubmit={onConfirmLeave}
                submitText="Leave"
                cancelText="Stay"
            >
                <p>Changes you made may not be saved.</p>
            </Dialog>
        </>
    );
};

export default observer(RolesResult);
