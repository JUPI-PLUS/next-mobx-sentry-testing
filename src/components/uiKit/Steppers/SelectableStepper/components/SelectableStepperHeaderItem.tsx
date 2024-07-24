// libs
import React, { useMemo } from "react";

// models
import { SelectableStepperHeaderItemProps } from "../models";

//  components
import CheckIcon from "../../../Icons/CheckIcon";

const SelectableStepperHeaderItem = ({
    stepIndex,
    isActive,
    isPassed,
    isLastItem,
    isNextStepsDisabled,
    setActiveStep,
    activeStep,
    title,
}: SelectableStepperHeaderItemProps) => {
    const stepperIcon = useMemo(
        () => (
            <div
                className={`w-6 h-6 rounded-full flex items-center justify-center border-1.5 ${
                    isPassed && "border-none bg-green-100"
                } ${isActive ? "border-green-100" : "border-dark-400"}`}
            >
                {isPassed ? (
                    <CheckIcon className="stroke-white" />
                ) : (
                    <p className={`text-xs font-bold ${isActive ? "text-green-100" : "text-dark-700"}`}>
                        {stepIndex + 1}
                    </p>
                )}
            </div>
        ),
        [stepIndex, isPassed, isActive]
    );

    const isNextStepChangeNotAllowed = isNextStepsDisabled && activeStep < stepIndex;

    const onSelectStep = () => {
        if (!setActiveStep || isActive || isNextStepsDisabled) return;
        if (isNextStepChangeNotAllowed) return;

        return setActiveStep(stepIndex);
    };

    const cursorClassName = isNextStepChangeNotAllowed ? "cursor-not-allowed" : "cursor-pointer";

    return (
        <li className={`flex ${!isLastItem && "w-full"} ${cursorClassName}`}>
            <div
                data-testid={`stepper-item-${stepIndex}`}
                className="px-3 flex flex-col items-center gap-1 relative"
                onClick={onSelectStep}
            >
                {stepperIcon}
                <p
                    data-testid={`stepper-item-title-${stepIndex}`}
                    className={`pt-1 text-center absolute bottom-0 transform translate-y-full text-sm leading-5 font-medium whitespace-nowrap ${
                        isActive ? "text-dark-900" : "text-dark-700"
                    }`}
                >
                    {title}
                </p>
            </div>
            {!isLastItem && (
                <div className={`w-full h-0.5 translate-y-2.5 ${isPassed ? "bg-green-100" : "bg-dark-500"}`}></div>
            )}
        </li>
    );
};

export default SelectableStepperHeaderItem;
