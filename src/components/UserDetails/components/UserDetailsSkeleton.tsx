import React from "react";

const UserDetailsSkeleton = () => {
    return (
        <div className="w-full px-6 py-5 my-0.5 bg-white rounded-t-lg border-b border-dark-400">
            <div className="flex items-center my-0.5">
                <div className="mr-4">
                    <div className="w-9 h-9 rounded-full bg-gray-300 animate-pulse" />
                </div>
                <div>
                    <div className="w-40 h-4 rounded bg-gray-300 animate-pulse mb-2" />
                    <div className="flex">
                        <div className="mr-3 w-28 h-4 animate-pulse rounded bg-gray-300" />
                        <div className="mr-3 w-28 h-4 animate-pulse rounded bg-gray-300" />
                        <div className="w-28 h-4 animate-pulse rounded bg-gray-300" />
                    </div>
                </div>
                <div className="ml-auto flex">
                    <div className="w-28 h-8 rounded bg-gray-300 animate-pulse" />
                </div>
            </div>
        </div>
    );
};

export default React.memo(UserDetailsSkeleton);
