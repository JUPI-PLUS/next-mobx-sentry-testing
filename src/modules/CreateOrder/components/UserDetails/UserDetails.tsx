// libs
import React, { useMemo } from "react";
import { format, fromUnixTime } from "date-fns";
import { observer } from "mobx-react";
import { useQuery } from "react-query";

// stores
import { useCreateOrderStore } from "../../store";

// api
import { userAvatar } from "../../../../api/users";
import { getSexTypes } from "../../../../api/dictionaries";

// helpers
import { addOffsetToUtcDate } from "../../../../shared/utils/date";
import { useGetBase64Image } from "../../../../shared/hooks/useGetBase64Image";
import { usePermissionsAccess } from "../../../../shared/hooks/useUserAccess";
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";

// models
import { UsersPermission } from "../../../../shared/models/permissions";

// constants
import { DATE_FORMATS } from "../../../../shared/constants/formates";
import { DICTIONARIES_QUERY_KEYS, USERS_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { ROUTES } from "../../../../shared/constants/routes";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";

// components
import Avatar from "../../../../components/uiKit/Avatar/Avatar";
import { OutlineButton } from "../../../../components/uiKit/Button/Button";
import LinkComponent from "../../../../components/uiKit/LinkComponent/LinkComponent";

const UserDetails = () => {
    const {
        createOrderStore: { userUUID, avatar, orderPatient },
    } = useCreateOrderStore();

    const isAllowedToSeeUserAvatar = usePermissionsAccess(UsersPermission.USER_AVATAR);

    const { data: sexTypesLookup } = useQuery(DICTIONARIES_QUERY_KEYS.SEX_TYPES, getSexTypes, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    const { data: avatarBase64 } = useGetBase64Image(
        USERS_QUERY_KEYS.AVATAR(userUUID, avatar),
        userAvatar(userUUID, avatar),
        isAllowedToSeeUserAvatar && Boolean(userUUID) && Boolean(avatar)
    );

    const sexTypeLabel = useMemo(
        () => getLookupItem(sexTypesLookup, orderPatient?.sex_id)?.label || "",
        [sexTypesLookup, orderPatient]
    );

    const fullName = `${orderPatient?.first_name ?? ""} ${orderPatient?.last_name ?? ""}`;

    return (
        <div className="px-6 py-4 bg-white rounded-t-lg border-b border-dark-400">
            <div className="flex items-center">
                <div className="mr-4">
                    <Avatar
                        image={avatarBase64}
                        firstName={orderPatient?.first_name}
                        lastName={orderPatient?.last_name}
                    />
                </div>
                <div>
                    <div className="text-md font-bold break-word" data-testid="patientFullName">
                        {fullName}
                    </div>
                    <div>
                        <span className="text-sm mr-3">
                            <span className="text-dark-700 mr-1">Birthdate</span>
                            <span className="font-semibold" data-testid="patientBirthday">
                                {format(
                                    addOffsetToUtcDate(fromUnixTime(orderPatient?.birth_date ?? 0)),
                                    DATE_FORMATS.DATE_ONLY
                                )}
                            </span>
                        </span>
                        <span className="text-sm">
                            <span className="text-dark-700 mr-1">Sex</span>
                            <span className="font-semibold" data-testid="patientSex">
                                {sexTypeLabel}
                            </span>
                        </span>
                    </div>
                </div>
                <div className="ml-auto flex">
                    <LinkComponent href={{ pathname: ROUTES.patientProfile.route, query: { patientUUID: userUUID } }}>
                        <OutlineButton text="View profile" size="sm" data-testid="view-profile-link" />
                    </LinkComponent>
                </div>
            </div>
        </div>
    );
};

export default observer(UserDetails);
