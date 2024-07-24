import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { PermissionsFormValues } from "../../../models";
import { usePermissionsStore } from "../../../store";

export const useSetValuesOnActiveRoleChange = (values?: PermissionsFormValues) => {
    const {
        permissionsStore: { activeRole, setupCurrentPermissions },
    } = usePermissionsStore();

    const { reset } = useFormContext();

    useEffect(() => {
        if (activeRole === null && values) {
            reset(values);
            setupCurrentPermissions(values);
        }
    }, [activeRole]);
};
