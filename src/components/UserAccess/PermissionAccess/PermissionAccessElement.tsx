import React, { FC } from "react";
import UserAccessElement from "../UserAccessElement";
import { UserAccessProps } from "../models";
import { observer } from "mobx-react";
import { useRootStore } from "../../../shared/store";

const PermissionAccessElement: FC<Omit<UserAccessProps, "current">> = ({ children, ...rest }) => {
    const {
        user: { permissions },
    } = useRootStore();

    return (
        <UserAccessElement {...rest} current={permissions}>
            {children}
        </UserAccessElement>
    );
};

export default observer(PermissionAccessElement);
