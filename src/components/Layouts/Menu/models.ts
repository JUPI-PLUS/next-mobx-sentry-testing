import { WholePermissionsGroups } from "../../../shared/models/permissions";

export interface MenuProps {
    isMenuToggled: boolean;
    toggle: (trigger?: boolean) => void;
}

export type MenuItem = {
    path: string;
    icon: JSX.Element;
    label: string;
    permissions?: {
        list: number[];
        tolerant: boolean;
    };
};

export type MenuItemProps = Omit<MenuItem, "path"> & { isActive?: boolean; isOpen: boolean; onClick?: () => void };

export interface MenuChildItem extends Omit<MenuMainItem, "route" | "icon" | "child"> {
    route: string;
}

export interface MenuMainItem {
    route?: string;
    label: string;
    icon: JSX.Element;
    permissions?: {
        list: WholePermissionsGroups[];
        tolerant?: boolean;
    };
    child?: MenuChildItem[];
}
