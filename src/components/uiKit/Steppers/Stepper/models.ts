// libs
import { ReactNode } from "react";

export interface StepperProps {
    headerClassName?: string;
    containerClassName?: string;
    titles?: string[];
    children: ReactNode | ReactNode[];
    activeStep: number;
    isLoading?: boolean;
}

export interface StepperHeaderProps {
    activeStep: number;
    stepQuantity: number;
    title?: string;
    className?: string;
}
