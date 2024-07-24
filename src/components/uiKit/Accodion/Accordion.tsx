import React, { FC, useEffect, useRef } from "react";
import { useDisclosure } from "../../../shared/hooks/useDisclosure";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { AccordionProps } from "./models";

const Accordion: FC<AccordionProps> = ({
    title,
    children,
    isOpen = false,
    rounded = true,
    startActions,
    endActions,
    onClose,
    containerClassName = "",
    titleOpenContainerClassName = "",
    titleCloseContainerClassName = "",
}) => {
    const isMounted = useRef<boolean | undefined>();
    const {
        isOpen: isAccordionOpen,
        toggle: toggleAccordion,
        onOpen: onOpenAccordion,
        onClose: onCloseAccordion,
    } = useDisclosure(isOpen);

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        if (isOpen) {
            onOpenAccordion();
        } else {
            onCloseAccordion();
        }
    }, [isOpen]);

    const onAccordionTitleClick = () => {
        if (isOpen) onClose?.();
        toggleAccordion();
    };

    const accordionVisibilityClassName = isAccordionOpen
        ? "flex flex-col gap-y-1 max-h-9999"
        : "max-h-0 overflow-hidden";
    const isAccordionRoundedClassName = rounded ? "rounded-md" : "";
    const titleContainerClassName = isAccordionOpen ? titleOpenContainerClassName : titleCloseContainerClassName;

    return (
        <div className={`${containerClassName}`}>
            <div
                className={`p-2 border border-dark-400 flex items-center gap-x-2 cursor-pointer ${isAccordionRoundedClassName} ${titleContainerClassName}`}
                onClick={onAccordionTitleClick}
                data-testid={`accordion-title-${title}`}
            >
                {startActions}
                <span className="w-4 h-4">
                    {isAccordionOpen ? (
                        <ChevronUpIcon className="stroke-dark-700" />
                    ) : (
                        <ChevronDownIcon className="stroke-dark-700" />
                    )}
                </span>
                <span className="text-md">{title}</span>
                {endActions}
            </div>
            <div
                data-testid={`accordion-content-${title}`}
                className={`transition-all duration-250 ${accordionVisibilityClassName}`}
            >
                {children}
            </div>
        </div>
    );
};

export default Accordion;
