// libs
import React, { Suspense, useEffect } from "react";
import { observer } from "mobx-react";
import dynamic from "next/dynamic";

// stores
import { useTemplatesStore } from "./store";

// components
import DialogSwitcher from "./components/Dialog/DialogSwitcher";
import ContextMenuGuard from "./components/Table/components/ContextMenu/ContextMenuGuard";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import { FiltersSkeleton, TemplatesTableSkeleton } from "./components/Skeletons";

const DynamicFilters = dynamic(() => import("./components/Header/Header"), {
    ssr: false,
    loading: () => <FiltersSkeleton />,
});

const DynamicTemplatesTable = dynamic(() => import("./components/Table/TemplateTable"), {
    ssr: false,
    loading: () => <TemplatesTableSkeleton />,
});

const TemplatesModule = () => {
    const {
        templatesStore: { cleanup },
    } = useTemplatesStore();

    useEffect(() => () => cleanup(), []);

    return (
        <div className="h-full overflow-hidden">
            <div className="grid grid-rows-[40px_auto] h-full gap-5 p-6">
                <ErrorBoundary>
                    <Suspense fallback={<FiltersSkeleton />}>
                        <DynamicFilters />
                    </Suspense>
                </ErrorBoundary>
                <ErrorBoundary>
                    <Suspense fallback={<TemplatesTableSkeleton />}>
                        <DynamicTemplatesTable />
                    </Suspense>
                </ErrorBoundary>
                <ContextMenuGuard />
            </div>
            <DialogSwitcher />
        </div>
    );
};

export default observer(TemplatesModule);
