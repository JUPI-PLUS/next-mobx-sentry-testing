import React, { useRef } from "react";
import { useDisclosure } from "../../../../../shared/hooks/useDisclosure";
import Popper from "../../../../uiKit/Popper/Popper";
import { useClickAway } from "../../../../../shared/hooks/useClickAway";
import UserDropdown from "../UserDropdown/UserDropdown";
import Avatar from "../../../../uiKit/Avatar/Avatar";
import { useRootStore } from "../../../../../shared/store";
import { observer } from "mobx-react";
import { userAvatar } from "../../../../../api/users";
import { useGetBase64Image } from "../../../../../shared/hooks/useGetBase64Image";
import { USERS_QUERY_KEYS } from "../../../../../shared/constants/queryKeys";

const UserAvatar = () => {
    const {
        user: { uuid, user, avatar },
    } = useRootStore();
    const popperRef = useRef(null);
    const avatarRef = useRef(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useClickAway(popperRef, onClose, avatarRef);

    const { data: avatarBase64 } = useGetBase64Image(
        USERS_QUERY_KEYS.AVATAR(uuid, avatar),
        userAvatar(uuid, avatar),
        Boolean(uuid) && Boolean(avatar)
    );

    return (
        <div className="relative">
            <Popper
                offsetDistance={5}
                offsetSkidding={-5}
                placement="bottom-end"
                isOpen={isOpen}
                onClose={onClose}
                sourceRef={avatarRef}
            >
                <div data-testid="dropdown-container" ref={popperRef}>
                    <UserDropdown />
                </div>
            </Popper>
            <div ref={avatarRef} onClick={onOpen} className="rounded-full" data-testid="avatar-container">
                <Avatar image={avatarBase64} firstName={user?.first_name} lastName={user?.last_name} />
            </div>
        </div>
    );
};

export default observer(UserAvatar);
