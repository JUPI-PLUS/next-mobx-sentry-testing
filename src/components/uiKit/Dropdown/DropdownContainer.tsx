// libs
import React, { FC, useRef } from "react";

// hooks
import { useDisclosure } from "../../../shared/hooks/useDisclosure";

// models
import { DropdownContainerProps } from "./models";

// components
import Popper from "../Popper/Popper";
import Dropdown from "./Dropdown";

const DropdownContainer: FC<DropdownContainerProps> = ({
    children,
    items,
    direction,
    placement = "auto-end",
    closeOnClickOnSource = false,
    className = "",
    offsetDistance,
    offsetSkidding,
}) => {
    const expandableZoneRef = useRef(null);

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            {items && (
                <Popper
                    closeOnClickOnSource={closeOnClickOnSource}
                    placement={placement}
                    isOpen={isOpen}
                    onClose={onClose}
                    sourceRef={expandableZoneRef}
                    className={className}
                    offsetDistance={offsetDistance}
                    offsetSkidding={offsetSkidding}
                >
                    <ul className="py-3 bg-white shadow-dropdown rounded-md">
                        {items.map(item => (
                            <Dropdown
                                onCloseDropdownContainer={onClose}
                                key={item.title}
                                direction={direction}
                                {...item}
                            />
                        ))}
                    </ul>
                </Popper>
            )}
            <div ref={expandableZoneRef} className="inline-flex justify-between cursor-pointer w-full" onClick={onOpen}>
                {children}
            </div>
        </>
    );
};
export default DropdownContainer;
