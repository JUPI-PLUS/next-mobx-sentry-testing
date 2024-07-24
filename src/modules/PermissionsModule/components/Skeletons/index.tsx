import { CircularProgressLoader } from "../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import React from "react";

export const HeaderSkeleton = () => (
    <div className="flex items-center justify-between">
        <div className="w-72 h-10 bg-dark-100 rounded animate-pulse" />
        <div className="w-40 h-10 bg-dark-100 animate-pulse rounded" />
    </div>
);

export const RoleFilterSkeleton = () => <div className="h-40 w-full bg-dark-100 rounded animate-pulse" />;

export const RolesResultSkeleton = () => (
    <div className="flex gap-3 flex-col mt-3">
        <div className="w-full h-18 bg-dark-100 animate-pulse rounded" />
        <div className="w-full h-18 bg-dark-100 animate-pulse rounded" />
        <div className="w-full h-18 bg-dark-100 animate-pulse rounded" />
        <div className="w-full h-18 bg-dark-100 animate-pulse rounded" />
    </div>
);

export const RolesTableSkeleton = () => (
    <div className="pt-5 bg-white w-full shadow-card-shadow rounded-lg">
        <CircularProgressLoader containerClassName="flex w-full h-full items-center justify-center" />
    </div>
);
