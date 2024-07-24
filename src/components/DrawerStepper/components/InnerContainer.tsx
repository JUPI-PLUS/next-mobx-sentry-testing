import { useEffect } from "react";
import { DefaultValues, useFormContext } from "react-hook-form";
import { CircularProgressLoader } from "../../uiKit/CircularProgressLoader/CircularProgressLoader";
import { observer } from "mobx-react";
import { useDrawerStepperStore } from "../store";

interface InnerContainerProps<T> {
    children: JSX.Element;
    defaultValues: DefaultValues<T>;
}

const InnerContainer = <T,>({ children, defaultValues }: InnerContainerProps<T>) => {
    const {
        drawerStepperStore: { setupIsChangingStep, isStepChanging },
    } = useDrawerStepperStore();
    const { reset } = useFormContext();

    useEffect(() => {
        reset(defaultValues);
        setupIsChangingStep(false);
    }, [defaultValues, reset]);

    return isStepChanging ? (
        <div className="flex items-center justify-center">
            <CircularProgressLoader />
        </div>
    ) : (
        children
    );
};

export default observer(InnerContainer);
