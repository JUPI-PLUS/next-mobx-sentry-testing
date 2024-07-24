import { ReactNode } from "react";

export interface AccordionProps {
    title: ReactNode;
    children: JSX.Element | JSX.Element[];
    isOpen?: boolean;
    rounded?: boolean;
    startActions?: ReactNode;
    endActions?: ReactNode;
    onClose?: () => void;
    containerClassName?: string;
    titleOpenContainerClassName?: string;
    titleCloseContainerClassName?: string;
}
