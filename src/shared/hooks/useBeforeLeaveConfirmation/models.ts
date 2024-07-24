export interface UseBeforeLeaveConfirmationProps {
    isConfirmed: boolean;
    leaveFromRouteValue: string;
    leaveToRouteValue: string;
    setIsUserWarnedChange: (flag: boolean) => void;
}

export interface UseCancellationChangeRouteProps {
    isCanceled: boolean;
    leaveFromRouteValue: string;
    setIsUserWarnedChange: (flag: boolean) => void;
    isBrowserRouter: boolean;
    onRouteReverted: () => void;
}
