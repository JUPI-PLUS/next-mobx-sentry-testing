// libs
import React, { Suspense, useEffect } from "react";
import dynamic from "next/dynamic";

// components
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import { CircularProgressLoader } from "../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import DialogSwitcher from "./components/Dialog/DialogSwitcher";
import { useSampleTypesStore } from "./store";
import { observer } from "mobx-react";

const DynamicHeader = dynamic(() => import("./components/Header/Header"), {
    ssr: false,
    loading: () => <CircularProgressLoader />,
});

const DynamicSampleTypesTable = dynamic(() => import("./components/SampleTypesTable/SampleTypesTable"), {
    ssr: false,
    loading: () => <CircularProgressLoader />,
});

const SampleTypesModule = () => {
    const {
        sampleTypesStore: { initialize, cleanup },
    } = useSampleTypesStore();

    useEffect(() => {
        initialize();
        return cleanup;
    }, []);

    return (
        <div className="transition-transform flex-grow grid grid-rows-tablePage overflow-hidden pt-6 h-full max-h-full">
            <div className="px-6">
                <ErrorBoundary>
                    <Suspense fallback={<CircularProgressLoader />}>
                        <DynamicHeader />
                    </Suspense>
                </ErrorBoundary>
            </div>
            <div className="flex w-full h-full overflow-hidden px-6 pb-4">
                <div className="flex flex-col w-full h-full bg-white rounded-md shadow-card-shadow">
                    <ErrorBoundary>
                        <Suspense fallback={<CircularProgressLoader />}>
                            <DynamicSampleTypesTable />
                        </Suspense>
                    </ErrorBoundary>
                    <DialogSwitcher />
                </div>
            </div>
        </div>
    );
};

export default observer(SampleTypesModule);
