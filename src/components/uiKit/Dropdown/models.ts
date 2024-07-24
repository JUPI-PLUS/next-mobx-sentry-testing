import { Placement } from "@popperjs/core/lib/enums";

export type DropdownDirection = "left" | "right";

export interface DropdownItem {
    title: string;
    onClick?: () => void;
    child?: Array<DropdownItem>;
}

export interface DropdownProps extends DropdownItem {
    direction?: DropdownDirection;
    onCloseDropdownContainer?: () => void;
}

export interface DropdownContainerProps {
    items: Array<DropdownProps>;
    children: JSX.Element;
    direction?: DropdownDirection;
    placement?: Placement;
    closeOnClickOnSource?: boolean;
    offsetDistance?: number;
    offsetSkidding?: number;
    className?: string;
}
