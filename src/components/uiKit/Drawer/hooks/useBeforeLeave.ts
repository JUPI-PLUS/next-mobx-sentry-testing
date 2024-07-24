import { useCallback, useMemo, useState } from "react";

interface UseBeforeLeaveProps {
    onClose: () => void;
    askBeforeLeave: boolean;
    isDirty: boolean;
}

type UseBeforeLeave = [boolean, () => void, () => void, () => void];

const useBeforeLeave = ({ isDirty, askBeforeLeave, onClose }: UseBeforeLeaveProps): UseBeforeLeave => {
    const [isLeaveDrawerStarted, setIsLeaveDrawerStarted] = useState(false);

    const onCloseDrawer = useCallback(() => {
        if (askBeforeLeave && isDirty) {
            setIsLeaveDrawerStarted(true);
            return;
        }

        onClose();
    }, [isDirty, askBeforeLeave, onClose]);

    const onConfirmLeave = useCallback(() => {
        onClose();
    }, [onClose]);

    const onDiscardLeave = useCallback(() => {
        setIsLeaveDrawerStarted(false);
    }, []);

    const shouldShowConfirmationDialog = useMemo(
        () => askBeforeLeave && isDirty && isLeaveDrawerStarted,
        [askBeforeLeave, isDirty, isLeaveDrawerStarted]
    );

    return [shouldShowConfirmationDialog, onCloseDrawer, onConfirmLeave, onDiscardLeave];
};

export default useBeforeLeave;
