import { useRouter } from "next/router";
import { useEffect } from "react";
import { UseCancellationChangeRouteProps } from "./models";

export const useCancellationChangeRoute = ({
    isCanceled,
    leaveFromRouteValue,
    setIsUserWarnedChange,
    isBrowserRouter,
    onRouteReverted,
}: UseCancellationChangeRouteProps) => {
    const router = useRouter();
    useEffect(() => {
        if (isCanceled && leaveFromRouteValue) {
            setIsUserWarnedChange(false);
            if (isBrowserRouter) {
                window.history.pushState(null, "", leaveFromRouteValue);
            }
            router[isBrowserRouter ? "push" : "replace"](router.asPath, router.asPath, { shallow: true });
            onRouteReverted();
        }
    }, [isCanceled]);
};
