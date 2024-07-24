// libs
import React, { Suspense } from "react";
import dynamic from "next/dynamic";

// components
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import FullPageLoading from "../../components/uiKit/FullPageLoading/FullPageLoading";

const DynamicExaminationPreview = dynamic(() => import("./ExaminationPreview"), {
    ssr: false,
    loading: () => <FullPageLoading />,
});

const ExaminationPreviewModule = () => {
    return (
        <div className="w-full h-full bg-white p-6 text-sm">
            <ErrorBoundary>
                <Suspense fallback={<FullPageLoading />}>
                    <DynamicExaminationPreview />
                </Suspense>
            </ErrorBoundary>
        </div>
    );
};

export default ExaminationPreviewModule;
