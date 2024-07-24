// libs
import React, { FC, useEffect } from "react";
import { observer } from "mobx-react";
import { AxiosError } from "axios";
import { useQuery } from "react-query";

// stores
import { useOrderStore } from "../../store";

// api
import { details } from "../../../../api/users";

// models
import { ProfilePermission } from "../../../../shared/models/permissions";
import { OrderUserInformationProps } from "./models";
import { ServerResponse } from "../../../../shared/models/axios";
import { Patient } from "../../../../shared/models/business/user";

// constants
import { ROUTES } from "../../../../shared/constants/routes";
import { PATIENTS_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

// components
import { TextButton } from "../../../../components/uiKit/Button/Button";
import UserIcon from "../../../../components/uiKit/Icons/UserIcon";
import PermissionAccessElement from "../../../../components/UserAccess/PermissionAccess/PermissionAccessElement";
import LinkComponent from "../../../../components/uiKit/LinkComponent/LinkComponent";
import UserDetails from "../../../../components/UserDetails/UserDetails";
import UserDetailsSkeleton from "../../../../components/UserDetails/components/UserDetailsSkeleton";

const OrderUserInformation: FC<OrderUserInformationProps> = ({ userUUID }) => {
    const {
        orderStore: { isUserDeleted, userData, setupUserData },
    } = useOrderStore();

    const { data: user, isFetching: isUserDataFetching } = useQuery<ServerResponse<Patient>, AxiosError, Patient>(
        PATIENTS_QUERY_KEYS.PATIENT(userUUID),
        details(userUUID),
        {
            enabled: Boolean(userUUID),
            select: queryData => queryData.data.data,
        }
    );

    useEffect(() => {
        if (user && !isUserDataFetching) {
            setupUserData(user);
        }
    }, [user, isUserDataFetching]);

    if (isUserDataFetching || !userData) {
        return <UserDetailsSkeleton />;
    }

    return (
        <div className="w-full px-6 py-5 bg-white rounded-t-lg border-b border-dark-400">
            <div className="flex items-center">
                <UserDetails user={userData} />
                {!isUserDeleted && (
                    <PermissionAccessElement required={[ProfilePermission.VIEW_ONE]}>
                        <LinkComponent
                            href={{
                                pathname: ROUTES.patientProfile.route,
                                query: { patientUUID: userData.uuid },
                            }}
                            aTagProps={{ className: "ml-auto" }}
                        >
                            <TextButton
                                endIcon={<UserIcon className="stroke-dark-900" />}
                                text="View profile"
                                variant="neutral"
                                size="thin"
                                className="font-medium"
                                data-testid="view-profile-link"
                            />
                        </LinkComponent>
                    </PermissionAccessElement>
                )}
            </div>
        </div>
    );
};

export default observer(OrderUserInformation);
