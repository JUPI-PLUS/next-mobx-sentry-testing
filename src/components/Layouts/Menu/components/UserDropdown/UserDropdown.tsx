import React from "react";
import { ROUTES } from "../../../../../shared/constants/routes";
import { useRootStore } from "../../../../../shared/store";
import { observer } from "mobx-react";
import PermissionAccessElement from "../../../../UserAccess/PermissionAccess/PermissionAccessElement";
import { ProfilePermission } from "../../../../../shared/models/permissions";
import { useRouter } from "next/router";

const UserDropdown = () => {
    const { push } = useRouter();
    const { user, auth } = useRootStore();

    const onLogoutClick = async () => {
        await auth.logout();
    };

    const onProfileClick = () => {
        push({ pathname: ROUTES.patientProfile.route, query: { patientUUID: user.user?.uuid } });
    };

    return (
        <ul className="py-3 rounded-md bg-white shadow-menu-dropdown w-28">
            <PermissionAccessElement required={[ProfilePermission.VIEW_ONE]}>
                <li
                    className="px-4 py-2 cursor-pointer hover:bg-gray-200"
                    onClick={onProfileClick}
                    data-testid="profile-settings-menu-item"
                >
                    Profile
                </li>
            </PermissionAccessElement>
            <li
                className="px-4 py-2 cursor-pointer hover:bg-gray-200 text-red-100"
                onClick={onLogoutClick}
                data-testid="logout-menu-item"
            >
                Logout
            </li>
        </ul>
    );
};

export default observer(UserDropdown);
