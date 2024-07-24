// libs
import React, { useMemo } from "react";

// models
import { StepperHeaderProps } from "../models";

const StepperHeader = ({ title, activeStep, stepQuantity, className = "" }: StepperHeaderProps) => {
    const stepIndicator = useMemo(
        () => (
            <div className="flex gap-4">
                {new Array(stepQuantity).fill(null).map((_, index) => (
                    <div
                        key={`stepper-indicator-${index}`}
                        className={`h-0.5 w-full ${index <= activeStep ? "bg-brand-100" : "bg-dark-300"}`}
                    />
                ))}
            </div>
        ),
        [stepQuantity, activeStep]
    );
    return (
        <div className={`pb-8 text-center w-full ${className}`}>
            <p className="text-lg font-bold mb-1" data-testid="stepper-header-title">
                {title || `Step ${activeStep + 1}`}
            </p>
            <p className="text-sm leading-5 text-dark-700 mb-7" data-testid="stepper-header-steps">
                Step {activeStep + 1}/{stepQuantity}
            </p>
            {stepIndicator}
        </div>
    );
};

export default React.memo(StepperHeader);
