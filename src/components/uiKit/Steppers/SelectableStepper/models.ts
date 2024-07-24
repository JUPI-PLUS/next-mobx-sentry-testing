// libs
import { ReactNode } from "react";

export interface SelectableStepperProps {
    headerClassName?: string;
    containerClassName?: string;
    titles?: string[];
    children: ReactNode | ReactNode[];
    activeStep: number;
    setActiveStep?: (step: number) => void;
    isLoading?: boolean;
    isNextStepsDisabled?: boolean;
}

export type SelectableStepperHeaderProps = Pick<
    SelectableStepperProps,
    "activeStep" | "setActiveStep" | "titles" | "isNextStepsDisabled"
> & {
    stepQuantity: number;
    className?: string;
};

export type SelectableStepperHeaderItemProps = Pick<
    SelectableStepperProps,
    "setActiveStep" | "activeStep" | "isNextStepsDisabled"
> & {
    stepIndex: number;
    title: string;
    isActive: boolean;
    isPassed: boolean;
    isLastItem: boolean;
};
