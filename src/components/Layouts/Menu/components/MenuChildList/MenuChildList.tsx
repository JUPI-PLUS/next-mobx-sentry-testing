// libs
import React, { FC } from "react";
import { useRouter } from "next/router";

// models
import { MenuChildListProps } from "./models";

// components
import MenuChildrenItem from "../MenuChildItem/MenuChildItem";
import PermissionAccessElement from "../../../../UserAccess/PermissionAccess/PermissionAccessElement";

const MenuChildList: FC<MenuChildListProps> = ({ items, isOpen }) => {
    const { pathname } = useRouter();
    return (
        <div className={`transition-all ease-in-out duration-300 ${isOpen ? "max-h-screen" : "max-h-0 opacity-0"}`}>
            <ul className="pt-1 mb-3 overflow-hidden text-sm flex flex-col gap-1">
                {items.map(child => (
                    <PermissionAccessElement
                        key={child.route}
                        required={child.permissions?.list ?? []}
                        tolerant={child.permissions?.tolerant ?? false}
                    >
                        <MenuChildrenItem isActive={pathname.includes(child.route)} isOpen={isOpen} {...child} />
                    </PermissionAccessElement>
                ))}
            </ul>
        </div>
    );
};

export default MenuChildList;
