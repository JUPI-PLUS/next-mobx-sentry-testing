import React, { FC } from "react";
import Avatar from "../Avatar";
import { AvatarWithStatusIndicatorProps } from "../models";

const AvatarWithStatusIndicator: FC<AvatarWithStatusIndicatorProps> = ({ status, ...rest }) => {
    const statusColorClassName = status ? "bg-brand-100" : "bg-dark-400";

    return (
        <div className="relative">
            <Avatar {...rest} />
            <div
                className="absolute flex justify-center items-center w-6 h-6 top-0 right-0 rounded-full bg-white"
                data-testid={`${status}-avatar-status`}
            >
                <div className={`w-3 h-3 rounded-full ${statusColorClassName}`} />
            </div>
        </div>
    );
};

export default React.memo(AvatarWithStatusIndicator);
