import { observer } from "mobx-react";
import dynamic from "next/dynamic";
import React, { Suspense, useEffect } from "react";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import { usePermissionsStore } from "./store";
import { HeaderSkeleton, RoleFilterSkeleton, RolesResultSkeleton, RolesTableSkeleton } from "./components/Skeletons";

const DynamicHeader = dynamic(() => import("./components/Header/Header"), {
    loading: () => <HeaderSkeleton />,
});

const DynamicRolesForm = dynamic(() => import("./components/RolesFilters/RolesFilters"), {
    loading: () => <RoleFilterSkeleton />,
});

const DynamicRolesResults = dynamic(() => import("./components/RolesResult/RolesResult"), {
    loading: () => <RolesResultSkeleton />,
});

const DynamicPermissionsTable = dynamic(() => import("./components/PermissionsTable/PermissionsTable"), {
    loading: () => <RolesTableSkeleton />,
});

const PermissionsModule = () => {
    const {
        permissionsStore: { cleanup },
    } = usePermissionsStore();
    useEffect(() => () => cleanup(), []);

    return (
        <div className="transition-transform flex-grow grid grid-rows-tablePage overflow-hidden pt-6 pb-4 h-full max-h-full">
            <div className="px-6">
                <ErrorBoundary>
                    <Suspense fallback={<HeaderSkeleton />}>
                        <DynamicHeader />
                    </Suspense>
                </ErrorBoundary>
            </div>
            <div className="flex w-full h-full overflow-hidden px-6">
                <div className="mr-2 flex flex-col w-full max-w-xs">
                    <ErrorBoundary>
                        <Suspense fallback={<RoleFilterSkeleton />}>
                            <DynamicRolesForm />
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Suspense fallback={<RolesResultSkeleton />}>
                            <DynamicRolesResults />
                        </Suspense>
                    </ErrorBoundary>
                </div>
                <ErrorBoundary>
                    <Suspense fallback={<RolesTableSkeleton />}>
                        <DynamicPermissionsTable />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default observer(PermissionsModule);
