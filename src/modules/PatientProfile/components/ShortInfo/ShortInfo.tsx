// libs
import { FC, useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import { useQuery } from "react-query";
import { format, fromUnixTime } from "date-fns";
import { useRouter } from "next/router";

// constants
import { DICTIONARIES_QUERY_KEYS, USERS_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";
import { DATE_FORMATS } from "../../../../shared/constants/formates";

// helpers
import { userAvatar } from "../../../../api/users";
import { getPositions, getSexTypes } from "../../../../api/dictionaries";
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";
import { addOffsetToUtcDate } from "../../../../shared/utils/date";

// stores
import { usePatientStore } from "../../store";

// models
import { ProfilePermission, UsersPermission } from "../../../../shared/models/permissions";

// hooks
import { useGetBase64Image } from "../../../../shared/hooks/useGetBase64Image";
import { usePermissionsAccess } from "../../../../shared/hooks/useUserAccess";

// components
import ErrorBoundary from "../../../../components/ErrorBoundary/ErrorBoundary";
import InfoSection from "./components/InfoSection";
import LinkComponent from "../../../../components/uiKit/LinkComponent/LinkComponent";
import { PencilIcon } from "../../../../components/uiKit/Icons";
import AvatarWithStatus from "../../../../components/uiKit/Avatar/AvatarWithStatusIndicator/AvatarWithStatusIndicator";
import StaffManagement from "./components/StaffManagment/StaffManagement";
import PermissionAccessElement from "../../../../components/UserAccess/PermissionAccess/PermissionAccessElement";
import { useRootStore } from "../../../../shared/store";

const ShortInfo: FC<{ id: string }> = ({ id }) => {
    const { query } = useRouter();
    const {
        patientStore: { avatar, uuid, email, name, patient, position, setupSexTypes },
    } = usePatientStore();
    const { user: activeUser } = useRootStore();
    const isAllowedToSeeUserAvatar = usePermissionsAccess(UsersPermission.USER_AVATAR);

    const { data: avatarBase64 } = useGetBase64Image(
        USERS_QUERY_KEYS.AVATAR(uuid, avatar),
        userAvatar(uuid, avatar),
        isAllowedToSeeUserAvatar && Boolean(uuid) && Boolean(avatar)
    );

    const { data: positions = [] } = useQuery(DICTIONARIES_QUERY_KEYS.POSITIONS, getPositions, {
        select: queryData => toLookupList(queryData.data.data),
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
    });

    const { data: sexLookupList = [], isFetching: isSexLookupListFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.SEX_TYPES,
        getSexTypes,
        {
            select: queryData => toLookupList(queryData.data.data),
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
        }
    );

    useEffect(() => {
        if (sexLookupList.length && !isSexLookupListFetching) {
            setupSexTypes(sexLookupList);
        }
    }, [sexLookupList.length, isSexLookupListFetching]);

    const birthDate = useMemo(
        () => format(addOffsetToUtcDate(fromUnixTime(patient?.birth_date ?? 0)), DATE_FORMATS.DATE_ONLY_DOTS),
        [patient?.birth_date]
    );

    const sex = useMemo(() => getLookupItem(sexLookupList, patient?.sex_id)?.label, [patient?.sex_id, sexLookupList]);

    const isEditGeneralInfoHrefVisible = query.tab !== "0" && query.tab !== undefined;
    const isMe = activeUser?.uuid === patient?.uuid;

    return (
        <div className="relative max-h-full h-fit flex flex-col overflow-hidden bg-white border border-inset border-gray-200 shadow-card-shadow rounded-lg">
            <ErrorBoundary>
                {isEditGeneralInfoHrefVisible && (
                    <LinkComponent
                        href={{
                            query: {
                                ...query,
                                tab: 0,
                            },
                        }}
                    >
                        <PencilIcon className="absolute top-3 right-3 fill-dark-900 cursor-pointer" />
                    </LinkComponent>
                )}
                <div className="py-8 px-5 flex flex-col items-center gap-4">
                    <AvatarWithStatus
                        image={avatarBase64}
                        firstName={patient?.first_name}
                        lastName={patient?.last_name}
                        avatarClassName="!w-20 !h-20"
                        status={false}
                    />
                    <div className="flex flex-col items-center">
                        <span className="font-bold text-2xl leading-8 break-word text-center">{name}</span>
                        <span className="text-md font-normal text-dark-800" data-testid="patient-positions">
                            {positions.find(({ value }) => value === position)?.label ?? ""}
                        </span>
                    </div>
                </div>
                <div className="flex-1 text-md w-full px-5 overflow-y-auto">
                    <InfoSection title="Birthdate" text={birthDate} />
                    {/* <InfoSection title="Electronic Health Card" text="???" /> */}
                    <InfoSection title="Sex" text={sex!} />
                    <InfoSection title="Email" text={email} />
                    {/* <InfoSection title="Phone" text={phone} /> */}
                    {/* <InfoSection title="Citizenship" text="???" /> */}
                    {/* <InfoSection title="Preferred language" text="???" /> */}
                    {/* <InfoSection title="Contingent" text="???" /> */}
                    {/* <InfoSection title="Notes" text="????" orientation="vertical" /> */}
                </div>
                <div className="py-6">
                    {!isMe && (
                        <PermissionAccessElement required={ProfilePermission.MAKE_STAFF}>
                            <StaffManagement id={id} />
                        </PermissionAccessElement>
                    )}
                </div>
            </ErrorBoundary>
        </div>
    );
};

export default observer(ShortInfo);
