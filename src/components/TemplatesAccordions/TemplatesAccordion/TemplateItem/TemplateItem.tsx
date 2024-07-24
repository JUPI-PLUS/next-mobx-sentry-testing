import { FC } from "react";
import UrgencyButton from "../UrgencyButton/UrgencyButton";
import { TemplateItemProps } from "./models";
import { UrgencyStatus } from "../../../../shared/models/business/enums";

const TemplateItem: FC<TemplateItemProps> = ({
    name,
    sample_types_name,
    urgencyStatus = UrgencyStatus.NORMAL,
    isReadOnly,
    onStatusClick,
}) => {
    return (
        <div className="group/templateItem flex items-center justify-between leading-6 gap-3">
            <div className="flex items-center gap-2">
                <UrgencyButton urgency={urgencyStatus} size="sm" className="shrink-0" isActive isReadOnly />
                <span className="text-md text-dark-800 break-word">{name}</span>
            </div>
            <div className="flex items-center relative">
                {sample_types_name && (
                    <span
                        className={`w-20 text-right text-md font-medium text-dark-900 ${
                            !isReadOnly ? "group-hover/templateItem:invisible" : ""
                        }`}
                    >
                        {sample_types_name}
                    </span>
                )}
                {!isReadOnly && (
                    <div className="invisible absolute right-0 flex gap-1 group-hover/templateItem:visible">
                        <UrgencyButton
                            isActive={urgencyStatus === UrgencyStatus.NORMAL}
                            urgency={UrgencyStatus.NORMAL}
                            onClick={onStatusClick}
                        />
                        <UrgencyButton
                            isActive={urgencyStatus === UrgencyStatus.URGENT}
                            urgency={UrgencyStatus.URGENT}
                            onClick={onStatusClick}
                        />
                        <UrgencyButton
                            isActive={urgencyStatus === UrgencyStatus.EMERGENCY}
                            urgency={UrgencyStatus.EMERGENCY}
                            onClick={onStatusClick}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default TemplateItem;
