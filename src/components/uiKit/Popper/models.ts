import { Placement } from "@popperjs/core/lib/enums";
import { MutableRefObject } from "react";

export interface PopperProps {
    isOpen?: boolean;
    onClose: () => void;
    children: JSX.Element;
    className?: string;
    placement?: Placement;
    sourceRef: MutableRefObject<HTMLElement | SVGSVGElement | null>;
    closeOnClickOnSource?: boolean;
    offsetSkidding?: number;
    offsetDistance?: number;
}
