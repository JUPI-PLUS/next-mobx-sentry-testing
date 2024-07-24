// libs
import React, { Suspense, useEffect } from "react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { observer } from "mobx-react";

// stores
import { useOrderStore } from "./store";

// api
import { getOrderDetails } from "../../api/orders";

// models
import { OrderDetails } from "./models";

// constants
import { ORDERS_QUERY_KEYS } from "../../shared/constants/queryKeys";

// components
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import { HeaderSkeleton, SidebarSkeleton, TableSkeleton } from "./components/Skeletons";
import SelectedTemplatesDrawer from "./components/OrderInformation/components/SelectedTemplatesDrawer/SelectedTemplatesDrawer";
import { useDisclosure } from "../../shared/hooks/useDisclosure";
import UserDetailsSkeleton from "../../components/UserDetails/components/UserDetailsSkeleton";

const DynamicHeader = dynamic(() => import("./components/Header/Header"), {
    loading: () => <HeaderSkeleton />,
});

const DynamicOrderUserInformation = dynamic(() => import("./components/OrderUserInformation/OrderUserInformation"), {
    loading: () => <UserDetailsSkeleton />,
});

const DynamicExaminationsTable = dynamic(() => import("./components/ExaminationsTable/ExaminationsTable"), {
    loading: () => <TableSkeleton />,
});

const DynamicOrderInformation = dynamic(() => import("./components/OrderInformation/OrderInformation"), {
    loading: () => <SidebarSkeleton />,
});

const OrderModule = () => {
    const {
        query: { uuid },
    } = useRouter();
    const {
        orderStore: { cleanup, setupOrderDetails },
    } = useOrderStore();
    const orderUUID = uuid as string;

    const {
        isOpen: isSelectedTemplatesDrawerOpened,
        onOpen: onSelectedTemplatesDrawerOpen,
        onClose: onSelectedTemplatesDrawerClose,
    } = useDisclosure();

    const {
        data = {} as OrderDetails,
        isFetching,
        isRefetching,
    } = useQuery(ORDERS_QUERY_KEYS.ONE(orderUUID), getOrderDetails(orderUUID), {
        enabled: Boolean(uuid),
        select: queryData => queryData.data.data,
    });

    useEffect(() => setupOrderDetails(data), [data]);
    useEffect(() => () => cleanup(), []);

    return (
        <div className="transition-transform flex-grow grid grid-rows-innerPage overflow-hidden h-full max-h-full">
            <div className="flex items-center px-6">
                <ErrorBoundary>
                    <Suspense fallback={<HeaderSkeleton />}>
                        <DynamicHeader isFetching={isFetching && !isRefetching} />
                    </Suspense>
                </ErrorBoundary>
            </div>
            <div className="flex w-full h-full overflow-hidden pt-1 px-6 pb-4">
                <div className="flex flex-col w-full h-full bg-white rounded-md shadow-card-shadow border border-inset border-dark-400 pb-6">
                    <ErrorBoundary>
                        <Suspense fallback={<UserDetailsSkeleton />}>
                            <DynamicOrderUserInformation userUUID={data?.user_uuid || ""} />
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Suspense fallback={<TableSkeleton />}>
                            <DynamicExaminationsTable orderUUID={orderUUID} />
                        </Suspense>
                    </ErrorBoundary>
                </div>
                <div className="ml-2 flex flex-col w-full max-w-sm">
                    <ErrorBoundary>
                        <Suspense fallback={<SidebarSkeleton />}>
                            <DynamicOrderInformation
                                order={data}
                                onSelectedTemplatesDrawerOpen={onSelectedTemplatesDrawerOpen}
                            />
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </div>
            <SelectedTemplatesDrawer
                isOpen={isSelectedTemplatesDrawerOpened}
                onClose={onSelectedTemplatesDrawerClose}
            />
        </div>
    );
};

export default observer(OrderModule);
