// libs
import React, { FC } from "react";
import { useRouter } from "next/router";

// models
import { MenuListProps } from "./models";

// constants
import { menuItems } from "../../constants";

// components
import MenuItem from "../MenuItem/MenuItem";
import PermissionAccessElement from "../../../../UserAccess/PermissionAccess/PermissionAccessElement";
import MenuItemExpandable from "../MenuItemExpandable/MenuItemExpandable";

const MenuList: FC<MenuListProps> = ({ isOpen }) => {
    const { pathname } = useRouter();
    return (
        <ul className="transition-all duration-300 ease-in-out grid gap-y-1 auto-rows-auto overflow-x-auto px-4 pt-6 pb-4">
            {menuItems.map(menuItem => {
                const hasChild = Boolean(menuItem.child?.length);
                return (
                    <PermissionAccessElement
                        key={menuItem.label}
                        required={menuItem.permissions?.list ?? []}
                        tolerant={menuItem.permissions?.tolerant ?? false}
                    >
                        {hasChild ? (
                            <MenuItemExpandable
                                {...menuItem}
                                child={menuItem.child!}
                                isChildActive={menuItem.child!.some(childItem => pathname.includes(childItem.route))}
                                isOpen={isOpen}
                            />
                        ) : (
                            <MenuItem
                                {...menuItem}
                                isActive={menuItem.route ? pathname.includes(menuItem.route) : false}
                                isOpen={isOpen}
                            />
                        )}
                    </PermissionAccessElement>
                );
            })}
        </ul>
    );
};

export default React.memo(MenuList);
