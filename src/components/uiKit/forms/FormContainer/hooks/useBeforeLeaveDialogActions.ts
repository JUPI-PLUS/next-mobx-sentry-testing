import { MutableRefObject, useCallback, useState } from "react";

interface UseBeforeLeaveDialogActionsProps {
    resetFormAction: () => void;
    toObserveFormValue: MutableRefObject<unknown | null>;
    beforeLeaveConfirmation?: () => void;
    onCancelLeaveDialog: () => void;
}

export const useBeforeLeaveDialogActions = ({
    resetFormAction,
    toObserveFormValue,
    beforeLeaveConfirmation,
    onCancelLeaveDialog,
}: UseBeforeLeaveDialogActionsProps) => {
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [isLeaveCanceled, setIsLeaveCanceled] = useState(false);

    // Need to handle force redirect to another page cause reset method from react-hook-form
    // reset values and this action triggers new condition values for formStateBeforeLeave
    // and before leave confirmation dialog shows again
    const [isForceRedirect, setIsForceRedirect] = useState(false);
    const onRouteReverted = () => {
        setIsLeaveCanceled(false);
    };

    const onLeaveDialogSubmit = useCallback(() => {
        setIsForceRedirect(true);
        resetFormAction();
        setIsConfirmed(true);
        toObserveFormValue.current = null;

        beforeLeaveConfirmation?.();
    }, [beforeLeaveConfirmation, resetFormAction]);

    const cancelLeaveDialog = () => {
        onCancelLeaveDialog();
        setIsLeaveCanceled(true);
    };

    return { isConfirmed, isLeaveCanceled, isForceRedirect, onRouteReverted, onLeaveDialogSubmit, cancelLeaveDialog };
};
