import { useRouter } from "next/router";
import { useCallback, useEffect, useRef } from "react";
import { useConfirmationChangeRoute } from "./useConfirmationChangeRoute";
import { useCancellationChangeRoute } from "./useCancellationChangeRoute";

export const useBeforeLeaveConfirmation = (
    isBlock: boolean,
    onOpen: (trigger: boolean) => void,
    isConfirmed: boolean,
    isLeaveCanceled: boolean,
    onRouteReverted: () => void,
    onClose: () => void
) => {
    const router = useRouter();
    const isUserWarned = useRef(false);
    const leaveFromRouteValue = useRef("");
    const leaveToRouteValue = useRef("");
    const isBrowserRoutingTriggered = useRef(false);

    const setIsUserWarnedChange = (flag: boolean) => {
        isUserWarned.current = flag;
    };

    // Call order for useConfirmationChangeRoute & useCancellationChangeRoute is very important we should check confirmation dialog first
    useConfirmationChangeRoute({
        isConfirmed,
        leaveFromRouteValue: leaveFromRouteValue.current,
        leaveToRouteValue: leaveToRouteValue.current,
        setIsUserWarnedChange,
    });

    useCancellationChangeRoute({
        isCanceled: isLeaveCanceled,
        leaveFromRouteValue: leaveFromRouteValue.current,
        isBrowserRouter: isBrowserRoutingTriggered.current,
        setIsUserWarnedChange,
        onRouteReverted,
    });

    const handleRouteChangeError = useCallback(
        (nextBlockedRoute: string) => {
            if (router.asPath !== nextBlockedRoute) {
                if (isBlock && !isUserWarned.current) {
                    isBrowserRoutingTriggered.current = !(router.asPath === window.location.pathname);
                    leaveFromRouteValue.current = router.asPath;
                    leaveToRouteValue.current = nextBlockedRoute;
                    isUserWarned.current = true;
                    onOpen(true);
                    router.events.emit("routeChangeError");
                    if (!isBrowserRoutingTriggered.current) {
                        router.replace(router.asPath, router.asPath, { shallow: true });
                    }
                    // eslint-disable-next-line @typescript-eslint/no-throw-literal
                    throw "Abort route change. Please ignore this error.";
                }
            }
        },
        [isBlock, onOpen, router]
    );

    const beforeUnload = useCallback(
        (event: BeforeUnloadEvent) => {
            if (!isBlock) return;
            const message = "Do you want to leave this site?\n\nChanges you made may not be saved.";
            event.preventDefault();
            event.returnValue = message;
            return message;
        },
        [isBlock]
    );

    useEffect(() => {
        window.addEventListener("beforeunload", beforeUnload);
        router.events.on("routeChangeStart", handleRouteChangeError);

        return () => {
            window.removeEventListener("beforeunload", beforeUnload);
            router.events.off("routeChangeStart", handleRouteChangeError);
        };
    }, [beforeUnload, handleRouteChangeError, router.events, router.pathname]);

    const leaveConfirmation = () => {
        onClose();
        leaveToRouteValue.current && router.push(leaveToRouteValue.current);
    };

    return { leaveConfirmation };
};
