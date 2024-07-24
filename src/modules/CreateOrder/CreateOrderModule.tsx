// libs
import React, { Suspense, useEffect } from "react";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import dynamic from "next/dynamic";

// stores
import { useCreateOrderStore } from "./store";

// components
import Breadcrumbs from "../../components/uiKit/Breadcrumbs/Breadcrumbs";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import CreateOrderSkeleton from "./components/Skeletons";

const DynamicCreateOrder = dynamic(() => import("./CreateOrder"), {
    loading: () => <CreateOrderSkeleton />,
});

const CreateOrderModule = () => {
    const {
        query: { userId },
    } = useRouter();
    const {
        createOrderStore: { cleanup, setupUserUUID },
    } = useCreateOrderStore();

    const userUUID = userId as string;

    useEffect(() => setupUserUUID(userUUID), [userUUID]);

    useEffect(() => cleanup, []);

    return (
        <div className="grid grid-rows-[40px_auto] gap-3 h-full px-6 py-3 overflow-hidden">
            <ErrorBoundary>
                <Breadcrumbs label="Add order" />
            </ErrorBoundary>
            <div className="grid grid-cols-6 gap-2 overflow-hidden">
                <ErrorBoundary>
                    <Suspense fallback={<CreateOrderSkeleton />}>
                        <DynamicCreateOrder />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default observer(CreateOrderModule);
