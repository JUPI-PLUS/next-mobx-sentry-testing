// libs
import { observer } from "mobx-react";
import { FC } from "react";

// helpers
import { userAvatar } from "../../../../../../api/users";

// hooks
import { useGetBase64Image } from "../../../../../../shared/hooks/useGetBase64Image";
import { usePermissionsAccess } from "../../../../../../shared/hooks/useUserAccess";

// constants
import { USERS_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";
import EditPhoto from "./components/EditPhoto/EditPhoto";

// stores
import { usePatientStore } from "../../../../store";

// models
import { UsersPermission } from "../../../../../../shared/models/permissions";

// components
import Avatar from "../../../../../../components/uiKit/Avatar/Avatar";
import { TextButton } from "../../../../../../components/uiKit/Button/Button";
import FormToggle from "../../../../../../components/uiKit/forms/Toggle/FormToggle";

const GeneralInfoHeader: FC = () => {
    const {
        patientStore: { avatar, uuid, patient },
    } = usePatientStore();

    const isAllowedToSeeUserAvatar = usePermissionsAccess(UsersPermission.USER_AVATAR);

    const { data: avatarBase64 } = useGetBase64Image(
        USERS_QUERY_KEYS.AVATAR(uuid, avatar),
        userAvatar(uuid, avatar),
        isAllowedToSeeUserAvatar && Boolean(uuid) && Boolean(avatar)
    );
    return (
        <div className="py-4 px-5 flex justify-between items-center row-span-auto">
            <div className="flex items-center gap-5">
                <Avatar
                    image={avatarBase64}
                    firstName={patient?.first_name}
                    lastName={patient?.last_name}
                    avatarClassName="!w-14 !h-14"
                />
                {avatarBase64 ? (
                    <EditPhoto />
                ) : (
                    <TextButton text="Add photo" variant="transparent" size="thin" className="underline" />
                )}
            </div>
            <FormToggle label="Active status" labelPosition="end" name="status" disabled />
        </div>
    );
};

export default observer(GeneralInfoHeader);
