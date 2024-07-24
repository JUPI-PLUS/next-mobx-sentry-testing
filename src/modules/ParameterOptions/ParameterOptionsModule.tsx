// libs
import React, { Suspense, useEffect } from "react";
import { observer } from "mobx-react";
import dynamic from "next/dynamic";

// stores
import { useParameterOptionsStore } from "./store";

// components
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import DeleteOptionDialog from "./components/DeleteOptionDialog/DeleteOptionDialog";
import EditParameterOption from "./components/EditParameterOption/EditParameterOption";
import { HeaderSkeleton, ParametersTableSkeleton } from "./components/Skeletons";

const DynamicHeader = dynamic(() => import("./components/Header/Header"), {
    ssr: false,
    loading: () => <HeaderSkeleton />,
});

const DynamicParameterOptionsTable = dynamic(() => import("./components/ParameterOptionsTable/ParameterOptionsTable"), {
    ssr: false,
    loading: () => <ParametersTableSkeleton />,
});

const ParameterOptionsModule = () => {
    const {
        parameterOptionsStore: { isDeleteOptionDialogOpen, isEditOptionDialogOpen, cleanup, initialize },
    } = useParameterOptionsStore();

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
                <div className="flex flex-col w-full h-full bg-white rounded-md shadow-card-shadow">
                    <ErrorBoundary>
                        <Suspense fallback={<ParametersTableSkeleton />}>
                            <DynamicParameterOptionsTable />
                        </Suspense>
                    </ErrorBoundary>
                    {isDeleteOptionDialogOpen && <DeleteOptionDialog />}
                    {isEditOptionDialogOpen && <EditParameterOption />}
                </div>
            </div>
        </div>
    );
};

export default observer(ParameterOptionsModule);
