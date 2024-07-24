import React, { FC } from "react";
import { UserAccessProps } from "../models";
import UserAccessPage from "../UserAccessPage";
import { useRootStore } from "../../../shared/store";
import { observer } from "mobx-react";

const PermissionAccessPage: FC<Omit<UserAccessProps, "current">> = ({ children, ...rest }) => {
    const {
        user: { permissions },
    } = useRootStore();

    return (
        <UserAccessPage {...rest} current={permissions}>
            <>{children}</>
        </UserAccessPage>
    );
};

export default observer(PermissionAccessPage);
