// libs
import React, { cloneElement, FC, useRef } from "react";

// helpers
import { useDisclosure } from "../../../shared/hooks/useDisclosure";

// models
import { TooltipProps } from "./models";

// components
import Popper from "../Popper/Popper";

export const Tooltip: FC<TooltipProps> = ({
    children,
    text,
    className = "",
    popperClassName = "",
    isStatic = false,
    placement = "auto",
    enabled = true,
    offsetDistance = 8,
    offsetSkidding,
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleOpen = () => {
        if (!enabled) return;
        if (isStatic) return onOpen();

        const innerText = contentRef.current!;
        if (innerText.scrollWidth > innerText.clientWidth) {
            onOpen();
        }
    };

    return (
        <div
            className={`inline-block ${className}`}
            ref={containerRef}
            onMouseEnter={handleOpen}
            onMouseLeave={onClose}
        >
            {typeof children === "string" ? (
                <p ref={contentRef} aria-label={children}>
                    {children}
                </p>
            ) : (
                cloneElement(children, { ref: contentRef })
            )}
            <Popper
                className={`popper-tooltip ${popperClassName}`}
                isOpen={isOpen}
                onClose={onClose}
                sourceRef={containerRef}
                placement={placement}
                offsetDistance={offsetDistance}
                offsetSkidding={offsetSkidding}
            >
                <div className="p-2 bg-dark-900 text-white shadow-menu-dropdown text-sm rounded-md break-word">
                    {text}
                    <div id="popper-arrow" data-popper-arrow></div>
                </div>
            </Popper>
        </div>
    );
};
