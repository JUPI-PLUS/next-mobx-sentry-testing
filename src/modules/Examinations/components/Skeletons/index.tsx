import React from "react";

export const SampleFilterSkeleton = () => <div className="h-40 w-full bg-dark-100 rounded animate-pulse" />;

export const ExaminationsContainerSkeleton = () => (
    <div className="flex flex-col w-full h-full bg-white rounded-md shadow-card-shadow">
        <div className="px-6 py-6 bg-white rounded-t-lg border-b border-dark-400">
            <div className="w-full h-14 bg-dark-100 animate-pulse rounded" />
        </div>
        <div className="h-full max-h-full overflow-y-hidden">
            <ExaminationsSkeleton />
        </div>
    </div>
);

export const ExaminationsSkeleton = () => (
    <div className="w-full h-full grid grid-rows-frAuto overflow-hidden">
        <div className="overflow-hidden pl-6 pr-3 pt-6">
            <div className="w-full h-full grid row-start-1 col-start-1 row-end-auto col-end-auto auto-rows-min overflow-hidden">
                <div className="grid grid-cols-12 pl-3 pb-3 border-b border-inset border-dark-400 text-dark-600 uppercase text-xs font-semibold bg-light-200 sticky top-0 z-10">
                    <div className="col-span-3 w-20 h-5 bg-dark-100 animate-pulse rounded" />
                    <div className="col-span-4 w-20 h-5 bg-dark-100 animate-pulse rounded" />
                    <div className="col-span-3 w-20 h-5 bg-dark-100 animate-pulse rounded" />
                    <div className="col-span-2 h-5 w-full flex justify-end">
                        <div className="w-20 h-5 bg-dark-100 animate-pulse rounded" />
                    </div>
                </div>
                <div className="w-full h-full py-6 flex flex-col gap-6">
                    <div>
                        <div className="mb-4">
                            <div className="w-60 h-5 bg-dark-100 animate-pulse rounded" />
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="w-full h-40 bg-dark-100 animate-pulse rounded" />
                            <div className="w-full h-40 bg-dark-100 animate-pulse rounded" />
                            <div className="w-full h-40 bg-dark-100 animate-pulse rounded" />
                            <div className="w-full h-40 bg-dark-100 animate-pulse rounded" />
                            <div className="w-full h-40 bg-dark-100 animate-pulse rounded" />
                            <div className="w-full h-40 bg-dark-100 animate-pulse rounded" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
