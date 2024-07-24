import { FC } from "react";
import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from "@heroicons/react/20/solid";
import { TableSortingIconsProps } from "../../models";

const TableSortingIcons: FC<TableSortingIconsProps> = ({ isSortingEnable, sortDirection }) => {
    if (!isSortingEnable) return null;

    switch (sortDirection) {
        case "asc":
            return <ArrowDownIcon className="w-4 h-4 fill-dark-600 group-hover/sortIcon:fill-dark-700" />;
        case "desc":
            return <ArrowUpIcon className="w-4 h-4 fill-dark-600 group-hover/sortIcon:fill-dark-700" />;
        default:
            return <ArrowsUpDownIcon className="w-4 h-4 fill-dark-500 group-hover/sortIcon:visible" />;
    }
};

export default TableSortingIcons;
