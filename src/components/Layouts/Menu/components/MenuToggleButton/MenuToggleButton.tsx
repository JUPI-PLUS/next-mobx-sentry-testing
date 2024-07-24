// libs
import React, { FC } from "react";

// components
import DoubleChevronLeftIcon from "../../../../uiKit/Icons/DoubleChevronLeftIcon";
import DoubleChevronRightIcon from "../../../../uiKit/Icons/DoubleChevronRightIcon";
import { IconButton } from "../../../../uiKit/Button/Button";

interface MenuToggleButtonProps {
    isOpen: boolean;
    onClick: (trigger: boolean) => void;
}

const MenuToggleButton: FC<MenuToggleButtonProps> = ({ onClick, isOpen }) => {
    const onToggleClick = () => {
        onClick(!isOpen);
    };

    return (
        <div className="w-full flex justify-end px-6.5">
            <IconButton
                aria-label={`${isOpen ? "Close" : "Open"} menu`}
                variant="transparent"
                size="thin"
                onClick={onToggleClick}
            >
                {isOpen ? (
                    <DoubleChevronLeftIcon className="transition-color duration-75 w-7 h-7 fill-dark-800 hover:bg-dark-400 bg-dark-200 rounded-full" />
                ) : (
                    <DoubleChevronRightIcon className="transition-color duration-75 w-7 h-7 fill-dark-800 hover:bg-dark-400 bg-dark-200 rounded-full" />
                )}
            </IconButton>
        </div>
    );
};

export default React.memo(MenuToggleButton);
