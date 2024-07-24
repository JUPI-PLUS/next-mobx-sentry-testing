import { Option } from "../../models";

export interface OptionItemProps {
    index: number;
    item: Option;
    items: Option[];
    isDisabled?: boolean;
    moveItem: (h: number, d: number) => void;
    onDelete: () => void;
    onEdit: (option: Option) => void;
}
