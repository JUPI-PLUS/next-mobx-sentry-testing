// libs
import React from "react";

// models
import { SelectableStepperHeaderProps } from "../models";

//  components
import SelectableStepperHeaderItem from "./SelectableStepperHeaderItem";

const SelectableStepperHeader = ({
    titles,
    activeStep,
    setActiveStep,
    stepQuantity,
    className = "",
    isNextStepsDisabled,
}: SelectableStepperHeaderProps) => (
    <ul className={`flex justify-between ${className}`}>
        {new Array(stepQuantity).fill(null).map((_, index) => {
            const title = titles?.[index] || `Step ${index + 1}`;

            return (
                <SelectableStepperHeaderItem
                    key={title}
                    stepIndex={index}
                    isActive={index === activeStep}
                    isPassed={index < activeStep}
                    isLastItem={stepQuantity === index + 1}
                    isNextStepsDisabled={isNextStepsDisabled}
                    setActiveStep={setActiveStep}
                    activeStep={activeStep}
                    title={title}
                />
            );
        })}
    </ul>
);

export default SelectableStepperHeader;
