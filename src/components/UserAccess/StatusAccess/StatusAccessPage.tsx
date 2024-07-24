import React, { FC } from "react";
import { UserAccessProps } from "../models";
import UserAccessPage from "../UserAccessPage";
import { useRootStore } from "../../../shared/store";
import { observer } from "mobx-react";

const StatusAccessPage: FC<Omit<UserAccessProps, "current">> = ({ children, ...rest }) => {
    const { user } = useRootStore();

    return (
        <UserAccessPage {...rest} current={[user.status]}>
            <>{children}</>
        </UserAccessPage>
    );
};

export default observer(StatusAccessPage);
