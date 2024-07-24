// libs
import React from "react";

// models
import { StepperProps } from "./models";

// components
import StepperHeader from "./components/StepperHeader";
import { CircularProgressLoader } from "../../CircularProgressLoader/CircularProgressLoader";

const Stepper = ({
    children,
    headerClassName,
    titles = [],
    activeStep,
    containerClassName = "",
    isLoading,
}: StepperProps) => {
    const nextChildren = Array.isArray(children) ? children[activeStep >= 0 ? activeStep : 0] : children;
    const stepQuantity = Array.isArray(children) ? children.length : 1;
    const title = titles[activeStep];

    return (
        <div className={containerClassName}>
            <StepperHeader
                title={title}
                activeStep={activeStep}
                stepQuantity={stepQuantity}
                className={headerClassName}
            />
            {isLoading ? (
                <div className="w-full h-full flex justify-center items-center">
                    <CircularProgressLoader />
                </div>
            ) : (
                nextChildren
            )}
        </div>
    );
};

export default Stepper;
