// libs
import React, { FC } from "react";

// hooks
import { useDisclosure } from "../../../shared/hooks/useDisclosure";

// models
import { DropdownProps } from "./models";

// components
import ChevronRightIcon from "../Icons/ChevronRightIcon";

const Dropdown: FC<DropdownProps> = ({ title, onClick, onCloseDropdownContainer, child, direction = "right" }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onItemClick = () => {
        onClick?.();
        onCloseDropdownContainer?.();
    };

    if (child) {
        return (
            <li
                className="p-2 pl-5 cursor-pointer w-full relative hover:bg-dark-200"
                onMouseEnter={onOpen}
                onMouseLeave={onClose}
            >
                {isOpen && (
                    <ul
                        className={`absolute top-0 py-3 min-w-52 bg-white shadow-dropdown rounded-md ${
                            direction === "right" ? "right-0 translate-x-full" : "left-0 -translate-x-full"
                        }`}
                    >
                        {child.map(item => (
                            <Dropdown
                                key={item.title}
                                onCloseDropdownContainer={onCloseDropdownContainer}
                                direction={direction}
                                {...item}
                            />
                        ))}
                    </ul>
                )}
                <div className="justify-between flex w-full gap-2" onClick={onItemClick}>
                    {title}
                    <ChevronRightIcon className="transition-color duration-75 w-6 h-6 stroke-dark-800" />
                </div>
            </li>
        );
    }

    return (
        <li onClick={onItemClick} className="py-2 px-5 justify-between cursor-pointer w-full hover:bg-dark-200">
            <div>{title}</div>
        </li>
    );
};

export default Dropdown;
