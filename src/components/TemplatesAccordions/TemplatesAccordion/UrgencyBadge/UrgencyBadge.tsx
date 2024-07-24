import { FC } from "react";
import { ChevronDoubleUpIcon, ChevronUpIcon } from "@heroicons/react/20/solid";
import { UrgencyBadgeProps } from "./models";
import { Tooltip } from "../../../uiKit/Tooltip/Tooltip";
import { IconButton } from "../../../uiKit/Button/Button";
import { UrgencyStatus } from "../../../../shared/models/business/enums";
import { getLookupItem } from "../../../../shared/utils/lookups";
import { useTemplatesAccordionsStore } from "../../store";
import { observer } from "mobx-react";

const UrgencyBadge: FC<UrgencyBadgeProps> = ({ urgency }) => {
    let Icon: typeof ChevronUpIcon;
    let buttonUrgencyColorClassName = "";
    let iconColorClassName = "";

    const {
        templatesAccordionsStore: { urgencyTypes },
    } = useTemplatesAccordionsStore();

    if (!urgency) return null;

    switch (urgency) {
        case UrgencyStatus.URGENT:
            buttonUrgencyColorClassName = "border-yellow-100 bg-yellow-100-2";
            Icon = ChevronUpIcon;
            iconColorClassName = "text-yellow-100 stroke-yellow-100";
            break;
        case UrgencyStatus.EMERGENCY:
        default:
            buttonUrgencyColorClassName = "border-red-100-2 bg-red-100-2";
            Icon = ChevronDoubleUpIcon;
            iconColorClassName = "text-red-100 stroke-red-100";
            break;
    }

    if (!Icon) return null;

    return (
        <Tooltip isStatic placement="top" text={getLookupItem(urgencyTypes, urgency)?.label ?? ""}>
            <IconButton variant="neutral" size="thin" className={`p-[1px] rounded ${buttonUrgencyColorClassName}`}>
                <Icon className={`w-4 h-4 ${iconColorClassName}`} />
            </IconButton>
        </Tooltip>
    );
};

export default observer(UrgencyBadge);
