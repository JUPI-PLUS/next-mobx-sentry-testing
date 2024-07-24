import React from "react";

export const HeaderSkeleton = () => (
    <div className="flex justify-between">
        <div className="h-8 w-32 bg-dark-100 rounded animate-pulse" />
        <div className="flex items-center gap-3">
            <div className="h-10 w-72 bg-dark-100 rounded animate-pulse mr-6" />
            <div className="h-10 w-60 bg-dark-100 rounded animate-pulse" />
            <div className="h-10 w-60 bg-dark-100 rounded animate-pulse" />
        </div>
    </div>
);

export const UserFilterSkeleton = () => <div className="h-40 w-full bg-dark-100 rounded animate-pulse" />;

export const OrdersTableSkeleton = () => (
    <div className="flex flex-col gap-3 w-full h-full bg-dark-100 rounded animate-pulse" />
);
