// libs
import React from "react";

// components
import { CircularProgressLoader } from "../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";

export const HeaderSkeleton = () => (
    <div className="flex items-center justify-between">
        <div className="w-36 h-10 bg-dark-100 rounded animate-pulse" />
        <div className="flex items-center gap-10">
            <div className="w-80 h-10 bg-dark-100 animate-pulse rounded" />
            <div className="w-80 h-10 bg-dark-100 animate-pulse rounded" />
            <div className="w-40 h-10 bg-dark-100 animate-pulse rounded" />
        </div>
    </div>
);

export const WorkplacesTableSkeleton = () => (
    <div className="flex flex-col w-full h-full bg-white rounded-md shadow-card-shadow">
        <CircularProgressLoader containerClassName="flex items-center justify-center w-full h-full" />
    </div>
);
