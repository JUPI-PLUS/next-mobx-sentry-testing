import React, { useEffect } from "react";
import FormDrawer from "../uiKit/Drawer/FormDrawer";
import { observer } from "mobx-react";
import { useDrawerStepperStore } from "./store";
import { DefaultValues, FieldValues } from "react-hook-form";
import InnerContainer from "./components/InnerContainer";
import { DrawerStepperProps } from "./models";

const DrawerStepper = <T extends FieldValues>({
    children,
    steps,
    resolver,
    onOptional,
    ...restDrawerProps
}: DrawerStepperProps<T>) => {
    const {
        drawerStepperStore: {
            activeStep,
            isSubmitButtonDisabled,
            goToPrevStep,
            cleanup,
            submitButtonText,
            isSubmitted,
            size,
        },
    } = useDrawerStepperStore();

    const nextChildren = Array.isArray(children) ? children[activeStep >= 0 ? activeStep : 0] : children;
    const { backText, saveText, schema, defaultValues } = steps[activeStep];
    const castedDefaultValues = defaultValues as DefaultValues<T>;

    useEffect(() => {
        return () => cleanup();
    }, []);

    return (
        <FormDrawer
            resolver={resolver}
            {...restDrawerProps}
            schema={schema}
            defaultValues={castedDefaultValues}
            submitText={submitButtonText || saveText}
            optionalText={backText}
            isSubmitButtonDisabled={isSubmitButtonDisabled}
            onOptional={onOptional ?? goToPrevStep}
            isDirty={isSubmitted}
            size={size}
        >
            <InnerContainer defaultValues={castedDefaultValues}>{nextChildren}</InnerContainer>
        </FormDrawer>
    );
};

export default observer(DrawerStepper);
