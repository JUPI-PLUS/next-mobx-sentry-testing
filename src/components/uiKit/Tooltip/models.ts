import { Placement } from "@popperjs/core";

export interface TooltipProps {
    children: JSX.Element | string;
    text: string;
    placement?: Placement;
    className?: string;
    popperClassName?: string;
    isStatic?: boolean;
    enabled?: boolean;
    offsetSkidding?: number;
    offsetDistance?: number;
}
