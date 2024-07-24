import React, { FC, useEffect, useState } from "react";
import { UserAccessProps } from "./models";
import { useRouter } from "next/router";
import { useUserAccess } from "../../shared/hooks/useUserAccess";
import { ROUTES } from "../../shared/constants/routes";
import FullPageLoading from "../uiKit/FullPageLoading/FullPageLoading";

const UserAccessPage: FC<UserAccessProps> = ({ current, required, tolerant = false, children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const isUserAllowed = useUserAccess(current, required, tolerant);

    useEffect(() => {
        if (!isUserAllowed) {
            router.replace(ROUTES.errors.forbidden.route);
            return;
        }
        setIsLoading(false);
    }, [isUserAllowed]);

    return isLoading ? <FullPageLoading /> : <>{children}</>;
};

export default UserAccessPage;
