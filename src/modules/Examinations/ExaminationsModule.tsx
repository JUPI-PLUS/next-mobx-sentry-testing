// libs
import React, { Suspense, useEffect } from "react";
import { observer } from "mobx-react";
import dynamic from "next/dynamic";

// stores
import { useExaminationStore } from "./store";

// components
import ExaminationResultsContainer from "./components/ExaminationResultsContainer/ExaminationResultsContainer";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import { ExaminationsSkeleton, SampleFilterSkeleton } from "./components/Skeletons";
import Header from "./components/Header/Header";

const DynamicFilters = dynamic(() => import("./components/Filters/Filters"), {
    ssr: false,
    loading: () => <SampleFilterSkeleton />,
});
const DynamicSamplesList = dynamic(() => import("./components/SamplesList/SamplesList"), {
    ssr: false,
});
const DynamicExaminationTable = dynamic(() => import("./components/ExaminationTable/ExaminationTable"), {
    ssr: false,
    loading: () => <ExaminationsSkeleton />,
});

const ExaminationsModule = () => {
    const {
        examinationStore: { activeSample, cleanup },
    } = useExaminationStore();

    useEffect(() => () => cleanup(), []);

    return (
        <div className="transition-transform flex-grow grid grid-rows-tablePage overflow-y-auto pt-6">
            <Header />
            <div className="flex w-full h-full overflow-hidden px-6 pb-4">
                <div className="mr-2 flex flex-col w-full max-w-xs">
                    <ErrorBoundary>
                        <Suspense fallback={<SampleFilterSkeleton />}>
                            <DynamicFilters />
                        </Suspense>
                    </ErrorBoundary>
                    <ErrorBoundary>
                        <Suspense>
                            <DynamicSamplesList />
                        </Suspense>
                    </ErrorBoundary>
                </div>
                {activeSample && (
                    <ErrorBoundary>
                        <ExaminationResultsContainer>
                            <Suspense fallback={<ExaminationsSkeleton />}>
                                <DynamicExaminationTable />
                            </Suspense>
                        </ExaminationResultsContainer>
                    </ErrorBoundary>
                )}
            </div>
        </div>
    );
};

export default observer(ExaminationsModule);
