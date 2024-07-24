// libs
import React from "react";
import { format, fromUnixTime } from "date-fns";
import { observer } from "mobx-react";

// api
import { userAvatar } from "../../api/users";

// helpers
import { addOffsetToUtcDate } from "../../shared/utils/date";
import { usePermissionsAccess } from "../../shared/hooks/useUserAccess";
import { useGetBase64Image } from "../../shared/hooks/useGetBase64Image";
import { getIsUserDeleted } from "../../shared/utils/user";

// models
import { UsersPermission } from "../../shared/models/permissions";
import { UserDetailsProps } from "./models";

// constants
import { DATE_FORMATS } from "../../shared/constants/formates";
import { DEFAULT_DELETED_USER_MOCK_TEXT } from "../../shared/constants/user";
import { USERS_QUERY_KEYS } from "../../shared/constants/queryKeys";

// components
import Avatar from "../uiKit/Avatar/Avatar";
import Dot from "../uiKit/Dot/Dot";

const UserDetails = ({ user }: UserDetailsProps) => {
    const isAllowedToSeeUserAvatar = usePermissionsAccess(UsersPermission.USER_AVATAR);

    const { data: avatarBase64 } = useGetBase64Image(
        USERS_QUERY_KEYS.AVATAR(user.uuid, user.profile_photo || ""),
        userAvatar(user.uuid, user.profile_photo || ""),
        isAllowedToSeeUserAvatar && Boolean(user.uuid) && Boolean(user.profile_photo)
    );

    const fullName = `${user?.first_name ?? ""} ${user?.last_name ?? ""}`;
    const isUserDeleted = getIsUserDeleted(user);

    if (!user) return null;

    return (
        <div className="flex items-center">
            <div className="mr-4">
                <Avatar image={avatarBase64} firstName={user.first_name} lastName={user.last_name} />
            </div>
            <div>
                <div className="text-md font-bold break-word" data-testid="user-full-name">
                    {isUserDeleted ? user.barcode : fullName}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm" data-testid="user-email">
                        <span className="text-dark-700 mr-1">Email</span>
                        {isUserDeleted ? DEFAULT_DELETED_USER_MOCK_TEXT : user.email}
                    </p>
                    <Dot />
                    <p className="text-sm" data-testid="user-birthdate">
                        <span className="text-dark-700 mr-1">Birthdate</span>
                        {isUserDeleted
                            ? DEFAULT_DELETED_USER_MOCK_TEXT
                            : format(
                                  addOffsetToUtcDate(
                                      fromUnixTime(user.birth_date_at_timestamp ?? user.birth_date ?? 0)
                                  ),
                                  DATE_FORMATS.DATE_ONLY
                              )}
                    </p>
                    <Dot />
                    <p className="text-sm" data-testid="user-barcode">
                        <span className="text-dark-700 mr-1">UUID</span>
                        {user.barcode}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default observer(UserDetails);
