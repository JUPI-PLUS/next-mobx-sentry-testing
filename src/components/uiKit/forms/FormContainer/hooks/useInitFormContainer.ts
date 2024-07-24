import { useEffect } from "react";
import { useRootStore } from "../../../../../shared/store";

interface UseInitFormContainerProps {
    isFormDirty: boolean;
    shouldShowConfirmationDialog: boolean;
}

export const useInitFormContainer = ({ isFormDirty, shouldShowConfirmationDialog }: UseInitFormContainerProps) => {
    const { auth } = useRootStore();
    useEffect(() => {
        auth.setupIsFormOnThePage(isFormDirty && shouldShowConfirmationDialog);
        return () => {
            auth.setupIsFormOnThePage(false);
        };
    }, [isFormDirty, shouldShowConfirmationDialog]);
};
