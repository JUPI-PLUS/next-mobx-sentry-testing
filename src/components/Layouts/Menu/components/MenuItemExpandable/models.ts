// models
import { MenuChildItem, MenuMainItem } from "../../models";

export interface MenuItemExpandableProps extends MenuMainItem {
    isOpen: boolean;
    isChildActive: boolean;
    child: MenuChildItem[];
}
