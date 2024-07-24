import React, { Suspense, useEffect } from "react";
import { observer } from "mobx-react";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import dynamic from "next/dynamic";
import { useOrdersStore } from "./store";
import { HeaderSkeleton, OrdersTableSkeleton, UserFilterSkeleton } from "./components/Skeletons";

const DynamicHeader = dynamic(() => import("./components/Header/Header"), {
    loading: () => <HeaderSkeleton />,
});
const DynamicUsersFilters = dynamic(() => import("./components/UsersFilter/UsersFilters"), {
    loading: () => <UserFilterSkeleton />,
});
const DynamicUsersResult = dynamic(() => import("./components/UsersResult/UsersResult"));
const DynamicOrdersTable = dynamic(() => import("./components/OrdersTable/OrdersTable"), {
    ssr: false,
    loading: () => <OrdersTableSkeleton />,
});

const OrdersModule = () => {
    const {
        ordersStore: { cleanup, initialize },
    } = useOrdersStore();

    useEffect(() => {
        initialize();
        return cleanup;
    }, []);

    return (
        <div className="transition-transform flex-grow grid grid-rows-tablePage overflow-hidden pt-6 h-full max-h-full">
            <div className="px-6">
                <ErrorBoundary>
                    <Suspense fallback={<HeaderSkeleton />}>
                        <DynamicHeader />
                    </Suspense>
                </ErrorBoundary>
            </div>
            <div className="flex w-full h-full overflow-hidden px-6 pb-4">
                <div className="mr-2 flex flex-col w-full max-w-xs">
                    <ErrorBoundary>
                        <Suspense fallback={<UserFilterSkeleton />}>
                            <DynamicUsersFilters />
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Suspense>
                            <DynamicUsersResult />
                        </Suspense>
                    </ErrorBoundary>
                </div>
                <ErrorBoundary>
                    <Suspense fallback={<OrdersTableSkeleton />}>
                        <DynamicOrdersTable />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default observer(OrdersModule);
