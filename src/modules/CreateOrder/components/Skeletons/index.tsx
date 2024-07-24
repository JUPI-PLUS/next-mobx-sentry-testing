// libs
import React from "react";

// components
import UserDetailsSkeleton from "../../../../components/UserDetails/components/UserDetailsSkeleton";

const CreateOrderSkeleton = () => {
    return (
        <>
            <div className="grid grid-rows-createOrderContentLayout col-start-0 col-span-4 bg-white w-full rounded-lg shadow-card-shadow border-gray-200 h-full max-h-full overflow-x-auto overflow-y-hidden relative">
                <UserDetailsSkeleton />
            </div>
            <div className="col-start-5 col-span-2 h-full w-full overflow-hidden shadow-card-shadow">
                <div className="flex flex-col h-full overflow-hidden">
                    <div className="flex flex-col flex-grow bg-white shadow-card-shadow border-gray-200 rounded-lg overflow-hidden px-6 pt-6 pb-2"></div>
                </div>
            </div>
        </>
    );
};

export default React.memo(CreateOrderSkeleton);
