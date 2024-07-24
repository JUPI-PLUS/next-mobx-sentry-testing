// libs
import React, { FC, useMemo } from "react";
import { useRouter } from "next/router";

// helpers
import { getLabelOpacity } from "../../utils";

// models
import { MenuItemProps } from "./models";

// components
import LinkComponent from "../../../../uiKit/LinkComponent/LinkComponent";
import FocusableBlock from "../../../../uiKit/FocusableBlock/FocusableBlock";

const MenuItem: FC<MenuItemProps> = ({ isOpen, icon, label, isActive, route }) => {
    const { push } = useRouter();

    const itemClassName = useMemo(
        () => (isActive ? "bg-brand-100 text-white hover:text-dark-900 focus:text-dark-900" : ""),
        [isActive]
    );

    const iconClassName = useMemo(() => (isActive ? "fill-white" : "fill-dark-800"), [isActive]);

    const labelClassName = getLabelOpacity(isOpen);

    const onItemClick = () => route && push(route);

    return (
        <li className="p-2 -m-2 overflow-hidden" data-testid={label}>
            <FocusableBlock
                className={`group focused flex items-center w-full rounded-md hover:bg-dark-300 focus:bg-dark-300 ${itemClassName}`}
                onClick={onItemClick}
            >
                <LinkComponent href={route} aTagProps={{ className: "flex items-center w-full", tabIndex: -1 }}>
                    <>
                        <div
                            className={`px-3 py-2.5 rounded-md group-focus:fill-dark-900 group-hover:fill-dark-900 ${iconClassName}`}
                        >
                            {icon}
                        </div>
                        <p className={`transition-opacity duration-300 select-none text-md ${labelClassName}`}>
                            {label}
                        </p>
                    </>
                </LinkComponent>
            </FocusableBlock>
        </li>
    );
};

export default MenuItem;
