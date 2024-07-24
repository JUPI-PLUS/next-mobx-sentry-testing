// libs
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { observer } from "mobx-react";

// components
import Breadcrumbs from "../../components/uiKit/Breadcrumbs/Breadcrumbs";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import { CircularProgressLoader } from "../../components/uiKit/CircularProgressLoader/CircularProgressLoader";

const ExamTemplate = dynamic(() => import("./ExamTemplate"), {
    loading: () => <CircularProgressLoader />,
});

const ExamTemplateModule = () => {
    const {
        query: { uuid },
    } = useRouter();

    const examTemplateUUID = uuid as string;

    return (
        <div className="grid grid-rows-innerPage h-full overflow-hidden">
            <ErrorBoundary>
                <div className="px-6 flex items-center">
                    <Breadcrumbs label={examTemplateUUID ? "Edit exam template" : "Create exam template"} />
                </div>
            </ErrorBoundary>
            <div className="px-6 overflow-hidden">
                <div className="px-6 pt-5 pb-10 bg-white w-full rounded-md shadow-card-shadow h-full max-h-full">
                    <ErrorBoundary>
                        <Suspense fallback={<CircularProgressLoader />}>
                            <ExamTemplate uuid={examTemplateUUID} />
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default observer(ExamTemplateModule);
