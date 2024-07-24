import { observer } from "mobx-react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, { Suspense, useEffect } from "react";
import ErrorBoundary from "../../components/ErrorBoundary/ErrorBoundary";
import { useTemplatesStore } from "../Templates/store";
import { useKitTemplateStore } from "./store";
import { FormSkeleton, HeaderSkeleton } from "./components/Skeletons";

const DynamicHeader = dynamic(() => import("./components/Header/Header"), {
    loading: () => <HeaderSkeleton />,
});

const DynamicForm = dynamic(() => import("./components/KitForm/KitForm"), {
    loading: () => <FormSkeleton />,
});

const KitTemplateModule = () => {
    const {
        query: { uuid },
    } = useRouter();
    const {
        templatesStore: { cleanupKitTemplate },
    } = useTemplatesStore();
    const {
        kitTemplateStore: { setupCurrentKitTemplateUUID, cleanup },
    } = useKitTemplateStore();

    useEffect(() => {
        if (uuid) {
            setupCurrentKitTemplateUUID(uuid as string);
        }
    }, [uuid]);

    useEffect(
        () => () => {
            // To work correctly, change `reactStrictMode` in next.config.js to `false`
            cleanup();
            cleanupKitTemplate();
        },
        []
    );

    return (
        <div className="transition-transform flex-grow grid grid-rows-innerPage overflow-hidden h-full max-h-full">
            <div className="flex items-center px-6">
                <ErrorBoundary>
                    <Suspense fallback={<HeaderSkeleton />}>
                        <DynamicHeader />
                    </Suspense>
                </ErrorBoundary>
            </div>
            <div className="flex w-full h-full overflow-hidden px-6 pb-4">
                <div className="flex flex-col w-full">
                    <ErrorBoundary>
                        <Suspense fallback={<FormSkeleton />}>
                            <DynamicForm />
                        </Suspense>
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default observer(KitTemplateModule);
