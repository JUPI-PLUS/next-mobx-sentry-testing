// libs
import React, { FC } from "react";

// components
import ChevronDownIcon from "../../../../../uiKit/Icons/ChevronDownIcon";
import ChevronUpIcon from "../../../../../uiKit/Icons/ChevronUpIcon";

interface MenuChevronButtonProps {
    isOpen: boolean;
}

const MenuChevronButton: FC<MenuChevronButtonProps> = ({ isOpen }) => {
    if (isOpen) {
        return <ChevronUpIcon className="ml-auto mr-2 stroke-dark-800" />;
    }
    return <ChevronDownIcon className="ml-auto mr-2 stroke-dark-800" />;
};

export default React.memo(MenuChevronButton);
