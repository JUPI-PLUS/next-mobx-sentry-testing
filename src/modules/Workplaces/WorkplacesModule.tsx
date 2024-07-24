// libs
import React, { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";
import { observer } from "mobx-react";

// stores
import { useWorkplacesStore } from "./store";

// components
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import { HeaderSkeleton, WorkplacesTableSkeleton } from "./components/Skeletons";

const DynamicHeader = dynamic(() => import("./components/Header/Header"), {
    ssr: false,
    loading: () => <HeaderSkeleton />,
});

const DynamicWorkplacesTable = dynamic(() => import("./components/WorkplacesTable/WorkplacesTable"), {
    ssr: false,
    loading: () => <WorkplacesTableSkeleton />,
});

const WorkplacesModule = () => {
    const {
        workplacesStore: { initialize, cleanup },
    } = useWorkplacesStore();

    useEffect(() => {
        initialize();
        return cleanup;
    }, []);

    return (
        <div className="transition-transform flex-grow grid grid-rows-autoFr overflow-hidden pt-6 h-full max-h-full">
            <div className="px-6 pb-5 h-auto">
                <ErrorBoundary>
                    <Suspense fallback={<HeaderSkeleton />}>
                        <DynamicHeader />
                    </Suspense>
                </ErrorBoundary>
            </div>
            <div className="flex w-full h-full overflow-hidden px-6 pb-4">
                <ErrorBoundary>
                    <Suspense fallback={<WorkplacesTableSkeleton />}>
                        <DynamicWorkplacesTable />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default observer(WorkplacesModule);
