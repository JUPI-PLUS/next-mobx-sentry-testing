// libs
import React from "react";

// models
import { SelectableStepperProps } from "./models";

// components
import { CircularProgressLoader } from "../../CircularProgressLoader/CircularProgressLoader";
import SelectableStepperHeader from "./components/SelectableStepperHeader";

// setActiveStep should be memoized to avoid rerender of stepper
const SelectableStepper = ({
    children,
    headerClassName,
    titles,
    activeStep,
    setActiveStep,
    isLoading,
    isNextStepsDisabled = false,
}: SelectableStepperProps) => {
    const nextChildren = Array.isArray(children) ? children[activeStep >= 0 ? activeStep : 0] : children;
    const stepQuantity = Array.isArray(children) ? children.length : 1;

    return (
        <>
            <SelectableStepperHeader
                titles={titles}
                activeStep={activeStep}
                setActiveStep={setActiveStep}
                stepQuantity={stepQuantity}
                className={headerClassName}
                isNextStepsDisabled={isNextStepsDisabled}
            />
            {isLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                    <CircularProgressLoader />
                </div>
            ) : (
                nextChildren
            )}
        </>
    );
};

export default SelectableStepper;
