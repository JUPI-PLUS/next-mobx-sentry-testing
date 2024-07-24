import { MouseEvent, PropsWithChildren, ReactNode } from "react";
import { UrgencyStatus } from "../../../shared/models/business/enums";

export type TemplatesAccordionProps = PropsWithChildren & {
    title: ReactNode;
    label?: ReactNode;
    isOpen?: boolean;
    isReadOnly?: boolean;
    status?: UrgencyStatus | null;
    onToggle?: () => void;
    onStatusClick?: (event: MouseEvent, status: UrgencyStatus) => void;
};
