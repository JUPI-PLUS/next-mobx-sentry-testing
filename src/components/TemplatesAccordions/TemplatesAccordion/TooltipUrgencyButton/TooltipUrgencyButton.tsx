import { FC } from "react";
import { UrgencyButtonProps } from "../UrgencyButton/models";
import UrgencyButton from "../UrgencyButton/UrgencyButton";
import { observer } from "mobx-react";
import { getLookupItem } from "../../../../shared/utils/lookups";
import { Tooltip } from "../../../uiKit/Tooltip/Tooltip";
import { useTemplatesAccordionsStore } from "../../store";

const TooltipUrgencyButton: FC<UrgencyButtonProps> = ({ urgency, ...rest }) => {
    const {
        templatesAccordionsStore: { urgencyTypes },
    } = useTemplatesAccordionsStore();

    return (
        <Tooltip
            isStatic
            placement="top"
            text={getLookupItem(urgencyTypes, urgency)?.label ?? ""}
            popperClassName="z-50"
        >
            <UrgencyButton urgency={urgency} {...rest} />
        </Tooltip>
    );
};

export default observer(TooltipUrgencyButton);
