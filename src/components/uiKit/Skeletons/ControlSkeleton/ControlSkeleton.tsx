import React, { FC } from "react";
import { ControlSkeletonProps } from "./models";

const ControlSkeleton: FC<ControlSkeletonProps> = ({ containerClassName = "", className = "", withLabel }) => {
    return (
        <div className={containerClassName}>
            {withLabel && <div className="h-4 w-14 bg-gray-300 animate-pulse rounded-lg mb-1.5" />}
            <div className={`h-10 rounded-lg bg-gray-300 animate-pulse ${className}`} />
        </div>
    );
};

export default ControlSkeleton;
