import React, { FC } from "react";
import LoadingIcon from "../Icons/LoadingIcon";
import { CircularProgressLoaderProps } from "./models";

export const CircularProgressLoader: FC<CircularProgressLoaderProps> = ({
    containerClassName = "",
    iconClassName = "",
    iconSize,
}) => {
    return (
        <div role="status" data-testid="circular-progress" className={containerClassName}>
            <LoadingIcon className={iconClassName} size={iconSize} />
        </div>
    );
};

export default React.memo(CircularProgressLoader);
