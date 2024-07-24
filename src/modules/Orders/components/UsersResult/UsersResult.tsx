// libs
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import { useQuery } from "react-query";

// stores
import { useOrdersStore } from "../../store";

// api
import { listOfUsers } from "../../../../api/users";

// helpers
import { usePermissionsAccess } from "../../../../shared/hooks/useUserAccess";
import { getIsUserDeleted } from "../../../../shared/utils/user";

// models
import { UsersPermission } from "../../../../shared/models/permissions";

// constants
import { USERS_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

// components
import UserDetailsCard from "../../../../components/uiKit/UserDetailsCard/UserDetailsCard";
import { CircularProgressLoader } from "../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";

const UsersResult = () => {
    const {
        ordersStore: { usersFiltersQueryString, isUserUUIDFilterFilled, setupActiveUser, activeUser },
    } = useOrdersStore();

    const isAllowedToSeeUserAvatar = usePermissionsAccess(UsersPermission.USER_AVATAR);

    const { isLoading, data } = useQuery(
        USERS_QUERY_KEYS.ORDERS_FILTER_USERS_LIST(usersFiltersQueryString),
        listOfUsers(usersFiltersQueryString),
        {
            enabled: Boolean(usersFiltersQueryString),
            select: queryData => queryData.data,
            onSuccess: queryData => {
                if (activeUser) {
                    const currentUser = queryData.data.find(({ uuid }) => activeUser.uuid === uuid);
                    if (currentUser) {
                        setupActiveUser(currentUser);
                    }
                }
            },
            retry: 0,
        }
    );

    useEffect(() => {
        if (isUserUUIDFilterFilled && data?.data[0]) {
            setupActiveUser(data.data[0]);
        }
    }, [data, isUserUUIDFilterFilled]);

    if (isLoading)
        return (
            <div className="flex justify-center">
                <CircularProgressLoader />
            </div>
        );

    if (!data || !usersFiltersQueryString) return null;

    return (
        <>
            <p className="text-dark-800 text-md text-center mb-3" data-testid="users-filter-list-total">
                {data.total} results found
            </p>
            <div className="overflow-auto shadow-card-shadow">
                <div className="max-h-full flex flex-col gap-y-2">
                    {data.data.map(user => (
                        <UserDetailsCard
                            key={user.uuid}
                            uuid={user.uuid}
                            avatar={isAllowedToSeeUserAvatar ? user.profile_photo ?? "" : ""}
                            birthday={user.birth_date_at_timestamp}
                            firstName={user.first_name}
                            lastName={user.last_name}
                            barcode={user.barcode}
                            variant={activeUser?.uuid === user.uuid ? "active" : "info"}
                            isDeleted={getIsUserDeleted(user)}
                            onClick={() => setupActiveUser(activeUser?.uuid !== user.uuid ? user : null)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default observer(UsersResult);
