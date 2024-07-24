import { useEffect, useState } from "react";
import { isAccessAllowed } from "../utils/auth";
import { useRootStore } from "../store";
import { CurrentAccess, RequiredAccess } from "../models/permissions";

export const usePermissionsAccess = (required: RequiredAccess, tolerant?: boolean) => {
    const {
        user: { permissions },
    } = useRootStore();
    return useUserAccess(permissions, required, tolerant);
};

export const useStatusAccess = (required: RequiredAccess, tolerant?: boolean) => {
    const {
        user: { status },
    } = useRootStore();

    return useUserAccess([status], required, tolerant);
};

export const useUserAccess = (current: CurrentAccess, required: RequiredAccess, tolerant?: boolean) => {
    const [isUserAllowed, setIsUserAllowed] = useState(() => isAccessAllowed(current, required, tolerant));

    useEffect(() => {
        setIsUserAllowed(isAccessAllowed(current, required, tolerant));
    }, [current, required, tolerant]);

    return isUserAllowed;
};
