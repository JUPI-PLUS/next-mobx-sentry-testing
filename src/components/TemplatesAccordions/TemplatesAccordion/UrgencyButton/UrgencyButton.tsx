import { MouseEvent, forwardRef, useMemo } from "react";
import { UrgencyButtonProps } from "./models";
import { UrgencyStatus } from "../../../../shared/models/business/enums";
import { IconButton } from "../../../uiKit/Button/Button";
import { preventClick } from "../../../../shared/utils/events";
import { EmergencyIcon, NormalIcon, UrgentIcon } from "../../../uiKit/Icons/UrgencyStatusIcons";

const UrgencyButton = forwardRef<HTMLButtonElement, UrgencyButtonProps>(
    ({ urgency, isActive, isReadOnly, className = "", size = "md", onClick }, ref) => {
        const [Icon, buttonUrgencyColorClassName] = useMemo(() => {
            switch (urgency) {
                case UrgencyStatus.URGENT:
                    return [UrgentIcon, "border-yellow-100 hover:border-yellow-100 bg-yellow-100 hover:!bg-yellow-100"];
                case UrgencyStatus.EMERGENCY:
                    return [EmergencyIcon, "border-red-100 hover:border-red-100 bg-red-100 hover:!bg-red-100"];
                case UrgencyStatus.NORMAL:
                default:
                    return [NormalIcon, "border-dark-600 hover:border-dark-600 bg-dark-600 hover:!bg-dark-600"];
            }
        }, [urgency]);

        const [btnSizeClassName, iconSizeClassName] = useMemo(() => {
            switch (size) {
                case "sm":
                    return ["w-4 h-4", "w-2 h-2"];
                case "md":
                default:
                    return ["w-6 h-6", ""];
            }
        }, [size]);

        const onUrgencyClick = (event: MouseEvent) => {
            onClick?.(event, urgency);
        };

        const iconColorClassName = isActive ? "fill-white" : "fill-dark-700";
        const activeButtonColorClassName = isActive ? buttonUrgencyColorClassName : "border-dark-600";

        return (
            <IconButton
                ref={ref}
                variant="neutral"
                size="thin"
                className={`${btnSizeClassName} ${className} flex items-center justify-center rounded-md border ${activeButtonColorClassName} ${
                    isReadOnly ? "cursor-default" : ""
                }`}
                onClick={isReadOnly ? preventClick : onUrgencyClick}
            >
                <Icon className={`${iconColorClassName} ${iconSizeClassName}`} />
            </IconButton>
        );
    }
);

export default UrgencyButton;
