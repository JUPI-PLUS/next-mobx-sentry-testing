import { MenuMainItem } from "../../models";

export interface MenuItemProps extends MenuMainItem {
    isOpen: boolean;
    isActive: boolean;
}
