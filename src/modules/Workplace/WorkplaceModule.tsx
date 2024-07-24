// libs
import React, { Suspense } from "react";
import { observer } from "mobx-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

// components
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import { WorkplaceSkeleton } from "./components/Skeletons";
import { HeaderSkeleton } from "../KitTemplate/components/Skeletons";

const DynamicHeader = dynamic(() => import("./components/Header/Header"), {
    loading: () => <HeaderSkeleton />,
});

const DynamicWorkplace = dynamic(() => import("./components/WorkplaceCard/WorkplaceCard"), {
    loading: () => <WorkplaceSkeleton />,
});

const WorkplaceModule = () => {
    const {
        query: { uuid },
    } = useRouter();

    const workplaceUUID = uuid as string;

    return (
        <div className="transition-transform flex-grow grid grid-rows-innerPage overflow-hidden h-full max-h-full">
            <div className="flex items-center px-6">
                <ErrorBoundary>
                    <Suspense fallback={<HeaderSkeleton />}>
                        <DynamicHeader uuid={workplaceUUID} />
                    </Suspense>
                </ErrorBoundary>
            </div>
            <div className="flex w-full h-full overflow-hidden px-6 pb-4">
                <ErrorBoundary>
                    <Suspense fallback={<WorkplaceSkeleton />}>
                        <DynamicWorkplace uuid={workplaceUUID} />
                    </Suspense>
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default observer(WorkplaceModule);
