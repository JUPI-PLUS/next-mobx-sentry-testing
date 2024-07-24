import BackButton from "../../../../components/uiKit/Breadcrumbs/BackButton";
import React from "react";
import { CircularProgressLoader } from "../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";

export const HeaderSkeleton = () => (
    <div className="flex items-center">
        <BackButton />
        <div className="h-8 w-48 bg-dark-100 rounded animate-pulse" />
    </div>
);

export const FormSkeleton = () => (
    <div className="flex flex-col w-full h-full border border-inset border-gray-200 pt-10 bg-white rounded-md shadow-card-shadow overflow-hidden">
        <CircularProgressLoader containerClassName="flex items-center justify-center w-full h-full" />
    </div>
);
