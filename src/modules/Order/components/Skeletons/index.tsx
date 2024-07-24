import BackButton from "../../../../components/uiKit/Breadcrumbs/BackButton";
import { CircularProgressLoader } from "../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import React from "react";

export const HeaderSkeleton = () => (
    <div className="flex items-center">
        <BackButton />
        <div className="h-8 w-48 bg-dark-100 rounded animate-pulse" />
    </div>
);

export const TableSkeleton = () => (
    <div className="flex items-center justify-center w-full h-full">
        <CircularProgressLoader />
    </div>
);

export const SidebarSkeleton = () => (
    <CircularProgressLoader containerClassName="h-full bg-white border border-inset border-dark-400 rounded-lg overflow-x-auto p-6 shadow-card-shadow flex items-center justify-center" />
);
