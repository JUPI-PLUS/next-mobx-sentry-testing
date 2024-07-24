export interface AvatarProps {
    image?: string;
    avatarClassName?: string;
    firstName?: string | null;
    lastName?: string | null;
}

export interface AvatarWithStatusIndicatorProps extends AvatarProps {
    status: boolean;
}
