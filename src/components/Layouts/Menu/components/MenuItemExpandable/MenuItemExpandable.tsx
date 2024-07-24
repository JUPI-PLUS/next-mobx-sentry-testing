// libs
import React, { FC, useMemo, useState } from "react";

// helpers
import { getLabelOpacity } from "../../utils";

// models
import { MenuItemExpandableProps } from "./models";

// components
import MenuChildList from "../MenuChildList/MenuChildList";
import MenuChevronButton from "./components/MenuChevronButton";
import FocusableBlock from "../../../../uiKit/FocusableBlock/FocusableBlock";

const MenuItemExpandable: FC<MenuItemExpandableProps> = ({ isOpen, child, icon, label, isChildActive }) => {
    const [isChildrenOpen, setIsChildrenOpen] = useState(isChildActive);

    const itemClassName = useMemo(() => {
        const classNames = [];
        if (!isOpen && isChildActive) {
            classNames.push("bg-brand-100 text-white");
        }
        if (isOpen && isChildrenOpen) {
            classNames.push("bg-dark-300 text-dark-900");
        }
        if (!isChildrenOpen) {
            classNames.push("hover:bg-dark-300 focus:bg-dark-300");
        }
        return classNames.join(" ");
    }, [isOpen, isChildActive, isChildrenOpen]);

    const iconClassName = useMemo(
        () =>
            !isOpen && isChildActive
                ? "fill-white"
                : "fill-dark-800 group-hover:fill-dark-900 group-focus:fill-dark-900",
        [isOpen, isChildActive]
    );

    const labelClassName = getLabelOpacity(isOpen);

    const onMenuItemClick = () => setIsChildrenOpen(prev => !prev);

    return (
        <li className="p-2 -m-2 overflow-hidden" data-testid={label}>
            <FocusableBlock
                className={`focused-expandable group flex flex-col w-full h-full rounded-md ${itemClassName}`}
                onClick={onMenuItemClick}
            >
                <div className="flex items-center">
                    <div className={`px-3 py-2.5 rounded-md ${iconClassName}`}>{icon}</div>
                    <p className={`transition-opacity duration-300 select-none text-md ${labelClassName}`}>{label}</p>
                    <MenuChevronButton isOpen={isChildrenOpen} />
                </div>
                <MenuChildList isOpen={Boolean(isOpen && isChildrenOpen)} items={child} />
            </FocusableBlock>
        </li>
    );
};

export default MenuItemExpandable;
