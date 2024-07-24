import React, { FC } from "react";
import UserAccessElement from "../UserAccessElement";
import { UserAccessProps } from "../models";
import { useRootStore } from "../../../shared/store";
import { observer } from "mobx-react";

const StatusAccessElement: FC<Omit<UserAccessProps, "current">> = ({ children, ...rest }) => {
    const { user } = useRootStore();

    return (
        <UserAccessElement {...rest} current={[user.status]}>
            {children}
        </UserAccessElement>
    );
};

export default observer(StatusAccessElement);
