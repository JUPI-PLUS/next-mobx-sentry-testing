import { MouseEvent } from "react";
import { UrgencyStatus } from "../../../../shared/models/business/enums";

export type UrgencyButtonSize = "sm" | "md";

export type UrgencyButtonProps = {
    urgency: UrgencyStatus;
    isActive?: boolean;
    isReadOnly?: boolean;
    size?: UrgencyButtonSize;
    onClick?: (event: MouseEvent, urgency: UrgencyStatus) => void;
    className?: string;
};
