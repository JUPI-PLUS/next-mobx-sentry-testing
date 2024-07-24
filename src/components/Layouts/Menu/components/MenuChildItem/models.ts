// models
import { MenuChildItem } from "../../models";

export interface MenuChildItemProps extends MenuChildItem {
    isActive: boolean;
    isOpen: boolean;
}
