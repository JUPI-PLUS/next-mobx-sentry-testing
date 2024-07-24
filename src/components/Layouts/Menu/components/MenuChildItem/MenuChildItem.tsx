// libs
import React, { FC } from "react";
import { useRouter } from "next/router";

// helpers
import { getLabelOpacity } from "../../utils";

// models
import { MenuChildItemProps } from "./models";

// components
import LinkComponent from "../../../../uiKit/LinkComponent/LinkComponent";
import FocusableBlock from "../../../../uiKit/FocusableBlock/FocusableBlock";

const MenuChildItem: FC<MenuChildItemProps> = ({ isActive, isOpen, label, route }) => {
    const { push } = useRouter();

    const labelClassName = getLabelOpacity(isOpen);

    const onItemClick = () => push(route);

    return (
        <li className="">
            <FocusableBlock
                className={`focused focus:-outline-offset-2 flex items-center w-full hover:bg-dark-300 focus:bg-dark-300 pl-10 pr-2 overflow-hidden py-1.5
               ${isActive ? "bg-brand-100 text-white hover:text-dark-900 focus:text-dark-900" : ""}`}
                onClick={onItemClick}
                tabIndex={isOpen ? 0 : -1}
            >
                <LinkComponent
                    href={route}
                    aTagProps={{
                        tabIndex: -1,
                    }}
                >
                    <p className={`transition-opacity duration-300 select-none whitespace-nowrap ${labelClassName}`}>
                        {label}
                    </p>
                </LinkComponent>
            </FocusableBlock>
        </li>
    );
};

export default MenuChildItem;
