import { FC } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { TemplatesAccordionProps } from "./models";
import TooltipUrgencyButton from "./TooltipUrgencyButton/TooltipUrgencyButton";
import { UrgencyStatus } from "../../../shared/models/business/enums";

const TemplatesAccordion: FC<TemplatesAccordionProps> = ({
    title,
    label,
    isOpen,
    isReadOnly,
    status,
    onToggle,
    onStatusClick,
    children,
}) => {
    return (
        <div className="border border-dark-500 rounded-md mb-2 last:mb-0 w-full select-none">
            <div
                className={`group/templatesAccordion flex items-center justify-between px-3 py-2 gap-2 cursor-pointer ${
                    isOpen ? " pb-2 border-b bg-dark-300 rounded-t-md" : ""
                }`}
                onClick={onToggle}
            >
                <div className="flex items-center gap-2">
                    <TooltipUrgencyButton urgency={status ?? UrgencyStatus.NORMAL} size="sm" isActive isReadOnly />
                    <span
                        className={`flex-1 text-md transition-colors break-word ${
                            isOpen ? "text-dark-900" : "text-dark-800"
                        }`}
                    >
                        {title}
                    </span>
                    <ChevronDownIcon
                        className={`w-4 h-4 transition-all ${isOpen ? "text-dark-900 rotate-180" : "text-dark-700"}`}
                    />
                </div>
                <div className="invisible flex gap-1 transition-none group-hover/templatesAccordion:visible">
                    <TooltipUrgencyButton
                        isActive={status === UrgencyStatus.NORMAL}
                        urgency={UrgencyStatus.NORMAL}
                        onClick={onStatusClick}
                        isReadOnly={isReadOnly}
                    />
                    <TooltipUrgencyButton
                        isActive={status === UrgencyStatus.URGENT}
                        urgency={UrgencyStatus.URGENT}
                        onClick={onStatusClick}
                        isReadOnly={isReadOnly}
                    />
                    <TooltipUrgencyButton
                        isActive={status === UrgencyStatus.EMERGENCY}
                        urgency={UrgencyStatus.EMERGENCY}
                        onClick={onStatusClick}
                        isReadOnly={isReadOnly}
                    />
                    {label && <span className="text-md font-medium text-dark-900">{label}</span>}
                </div>
            </div>
            {isOpen && <div className="px-3 py-2 flex flex-col gap-2">{children}</div>}
        </div>
    );
};

export default TemplatesAccordion;
