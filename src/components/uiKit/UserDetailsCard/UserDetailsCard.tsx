// libs
import React, { FC, useMemo } from "react";
import { format, fromUnixTime } from "date-fns";

// api
import { userAvatar } from "../../../api/users";

// helpers
import { addOffsetToUtcDate } from "../../../shared/utils/date";
import { useGetBase64Image } from "../../../shared/hooks/useGetBase64Image";

// models
import { UserDetailsCardProps } from "./models";

// constants
import { DATE_FORMATS } from "../../../shared/constants/formates";
import { USERS_QUERY_KEYS } from "../../../shared/constants/queryKeys";
import { DEFAULT_DELETED_USER_MOCK_TEXT } from "../../../shared/constants/user";

// components
import Avatar from "../Avatar/Avatar";
import FocusableBlock from "../FocusableBlock/FocusableBlock";

const UserDetailsCard: FC<UserDetailsCardProps> = ({
    variant = "info",
    firstName,
    lastName,
    birthday,
    uuid,
    avatar = "",
    containerClassName = "",
    onClick,
    isDeleted,
    barcode,
}) => {
    const cardColor = useMemo(() => {
        switch (variant) {
            case "active":
                return "bg-brand-100";
            case "info":
            default:
                return "bg-white";
        }
    }, [variant]);

    const isInfoVariant = variant === "info";
    const textColorMain = isInfoVariant ? "text-dark-900" : "text-white";
    const birthdayColorMain = isInfoVariant ? "text-dark-800" : "text-white";

    const fullName = `${firstName ?? ""} ${lastName ?? ""}`;

    const { data: avatarBase64 } = useGetBase64Image(
        USERS_QUERY_KEYS.AVATAR(uuid, avatar),
        userAvatar(uuid, avatar),
        Boolean(uuid) && Boolean(avatar)
    );

    return (
        <FocusableBlock
            className={`-outline-offset-1 flex border border-inset border-dark-300 items-center py-2 px-3 max-w-xs text-base font-medium rounded-md shadow-card-shadow ${cardColor} ${textColorMain} ${containerClassName}`}
            data-testid={`user-details-card-${firstName}-${lastName}`}
            onClick={onClick}
        >
            <div className="rounded-full bg-white">
                <Avatar image={avatarBase64} firstName={firstName} lastName={lastName} />
            </div>
            <div className="ml-3">
                <p className={`${textColorMain} break-word`} data-testid="user-details-card-full-name">
                    {isDeleted ? barcode : fullName}
                </p>
                <p className={`mt-0.5 text-sm ${birthdayColorMain}`} data-testid="user-details-card-birthdate">
                    {isDeleted
                        ? DEFAULT_DELETED_USER_MOCK_TEXT
                        : format(addOffsetToUtcDate(fromUnixTime(birthday ?? 0)), DATE_FORMATS.DATE_ONLY)}
                </p>
            </div>
        </FocusableBlock>
    );
};

export default UserDetailsCard;
