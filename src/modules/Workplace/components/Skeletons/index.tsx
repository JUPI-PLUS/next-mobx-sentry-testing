// libs
import React from "react";

// components
import { CircularProgressLoader } from "../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import BackButton from "../../../../components/uiKit/Breadcrumbs/BackButton";

export const HeaderSkeleton = () => (
    <div className="flex items-center">
        <BackButton />
        <div className="h-8 w-44 bg-dark-100 rounded animate-pulse" />
    </div>
);

export const WorkplaceSkeleton = () => (
    <div className="flex flex-col w-full h-full border border-inset border-gray-200 pt-10 bg-white rounded-md shadow-card-shadow overflow-hidden">
        <CircularProgressLoader containerClassName="flex items-center justify-center w-full h-full" />
    </div>
);
