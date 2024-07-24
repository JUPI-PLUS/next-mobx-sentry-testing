import { useQuery } from "react-query";
import { getPermissionsByRole } from "../../../../../../api/permissions";
import { PERMISSIONS_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";
import { usePermissionsStore } from "../../../../store";
import { observer } from "mobx-react";
import { useFormContext } from "react-hook-form";
import PermissionsTableSummary from "../PermissionsTableSummary/PermissionsTableSummary";
import { getOverwritedDefaultPermissions } from "../../../../utils";
import { useSetValuesOnActiveRoleChange } from "../../hooks/useSetValuesOnActiveRoleChange";
import React, { useEffect } from "react";
import GroupPermissions from "../GroupPermissions/GroupPermissions";

const PermissionsTableForm = () => {
    const {
        permissionsStore: {
            activeRole,
            groupedPermissions,
            recordOfPermissionsId,
            setupCurrentPermissions,
            resetIsPermissionDirty,
        },
    } = usePermissionsStore();
    const {
        reset,
        setValue,
        formState: { isDirty, defaultValues },
    } = useFormContext();

    const { isLoading: isPermissionsByRoleDataLoading } = useQuery(
        PERMISSIONS_QUERY_KEYS.BY_ROLE(activeRole! && activeRole.id),
        getPermissionsByRole(activeRole! && activeRole.id),
        {
            enabled: Boolean(activeRole?.id),
            select: queryData => queryData.data.data,
            onSuccess: queryData => {
                const overwritedDefaultPermissions = getOverwritedDefaultPermissions(
                    recordOfPermissionsId,
                    queryData,
                    true
                );

                reset(overwritedDefaultPermissions);
                queryData.map(permission => setValue(String(permission.id), true, { shouldDirty: false }));
                setupCurrentPermissions(overwritedDefaultPermissions);
            },
        }
    );

    useSetValuesOnActiveRoleChange(defaultValues);

    useEffect(() => {
        if (isDirty === false) {
            resetIsPermissionDirty();
        }
    }, [isDirty]);

    return (
        <>
            <div className="flex-1 overflow-y-auto px-6 pb-16">
                {groupedPermissions?.map(([title, permissions]) => (
                    <GroupPermissions
                        key={title}
                        title={title}
                        permissions={permissions}
                        isLoading={isPermissionsByRoleDataLoading}
                    />
                ))}
            </div>
            {isDirty && activeRole && <PermissionsTableSummary />}
        </>
    );
};

export default observer(PermissionsTableForm);
