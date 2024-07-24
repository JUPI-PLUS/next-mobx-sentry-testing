import React, { FC } from "react";
import { UserAccessProps } from "./models";
import { useUserAccess } from "../../shared/hooks/useUserAccess";

const UserAccessElement: FC<UserAccessProps> = ({ current, required, children, tolerant = false }) => {
    const isUserAllowed = useUserAccess(current, required, tolerant);

    return isUserAllowed ? <>{children}</> : null;
};

export default UserAccessElement;
