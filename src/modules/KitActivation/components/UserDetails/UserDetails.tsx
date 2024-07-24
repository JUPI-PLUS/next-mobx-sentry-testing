// libs
import React, { useEffect } from "react";
import { format, fromUnixTime } from "date-fns";
import { observer } from "mobx-react";
import { useRouter } from "next/router";
import { useQuery } from "react-query";

// constants
import { DICTIONARIES_QUERY_KEYS, PATIENTS_QUERY_KEYS, USERS_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { DATE_FORMATS } from "../../../../shared/constants/formates";
import { ROUTES } from "../../../../shared/constants/routes";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";

// helpers
import { addOffsetToUtcDate } from "../../../../shared/utils/date";
import { toLookupList } from "../../../../shared/utils/lookups";
import { details, userAvatar } from "../../../../api/users";
import { getSexTypes } from "../../../../api/dictionaries";

// stores
import { usePatientStore } from "../../../PatientProfile/store";
import { useKitActivationStore } from "../../store";

// models
import { UsersPermission } from "../../../../shared/models/permissions";

// hooks
import { useGetBase64Image } from "../../../../shared/hooks/useGetBase64Image";
import { usePermissionsAccess } from "../../../../shared/hooks/useUserAccess";

// components
import Avatar from "../../../../components/uiKit/Avatar/Avatar";
import { OutlineButton } from "../../../../components/uiKit/Button/Button";
import LinkComponent from "../../../../components/uiKit/LinkComponent/LinkComponent";
import { showErrorToast } from "../../../../components/uiKit/Toast/helpers";

const UserDetails = () => {
    const {
        replace,
        query: { userId },
    } = useRouter();

    const {
        patientStore: { setupSexTypes },
    } = usePatientStore();

    const {
        kitActivationStore: { orderPatient, setupOrderPatient },
    } = useKitActivationStore();

    const userUUID = userId as string;

    const isAllowedToSeeUserAvatar = usePermissionsAccess(UsersPermission.USER_AVATAR);

    const { data: patientDetails, isFetching: isPatientDetailsFetching } = useQuery(
        PATIENTS_QUERY_KEYS.PATIENT(userUUID),
        details(userUUID),
        {
            enabled: Boolean(userUUID),
            select: queryData => queryData.data.data,
            onError: () => {
                showErrorToast({ title: "Patient not found" });
                replace(ROUTES.orders.list.route);
            },
        }
    );

    const { data: sexTypes, isFetching: isSexTypesFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.SEX_TYPES,
        getSexTypes,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            refetchOnWindowFocus: false,
            select: queryData => queryData.data.data,
        }
    );

    const profilePhoto = orderPatient?.profile_photo ?? "";

    const { data: avatarBase64 } = useGetBase64Image(
        USERS_QUERY_KEYS.AVATAR(userUUID, profilePhoto),
        userAvatar(userUUID, profilePhoto),
        isAllowedToSeeUserAvatar && Boolean(userUUID) && Boolean(profilePhoto)
    );

    useEffect(() => {
        if (patientDetails && !isPatientDetailsFetching) {
            setupOrderPatient(patientDetails);
        }
    }, [patientDetails, isPatientDetailsFetching]);

    useEffect(() => {
        if (sexTypes && !isSexTypesFetching) {
            setupSexTypes(toLookupList(sexTypes));
        }
    }, [sexTypes, isSexTypesFetching]);

    const sexType = sexTypes?.find(type => type.id === orderPatient?.sex_id);
    const patientFirstName = orderPatient?.first_name;
    const patientLastName = orderPatient?.last_name;

    return (
        <div className="px-6 py-4 bg-white rounded-t-lg border-b border-dark-400">
            <div className="flex items-center">
                <div className="mr-4">
                    <Avatar image={avatarBase64} firstName={patientFirstName} lastName={patientLastName} />
                </div>
                <div>
                    <div className="text-md font-bold break-word" data-testid="patientFullName">
                        {patientFirstName} {patientLastName}
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
                                {sexType?.name}
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
