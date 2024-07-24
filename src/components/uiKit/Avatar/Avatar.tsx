import React, { FC } from "react";
import { AvatarProps } from "./models";

const Avatar: FC<AvatarProps> = ({ image = "", firstName, lastName, avatarClassName = "" }) => {
    if (image) {
        return (
            <div className={`w-9 h-9 rounded-full bg-gray-500 cursor-pointer ${avatarClassName}`} data-testid="avatar">
                <img
                    src={image}
                    alt="user-avatar"
                    className="rounded-full w-full h-full object-cover"
                    data-testid="avatar-image"
                />
            </div>
        );
    }

    return (
        <div
            className={`w-9 h-9 rounded-full bg-dark-300 text-dark-700 cursor-pointer flex items-center justify-center text-xs font-semibold ${avatarClassName}`}
            data-testid="avatar-placeholder"
        >
            {firstName?.charAt(0)} {lastName?.charAt(0)}
        </div>
    );
};

export default Avatar;
