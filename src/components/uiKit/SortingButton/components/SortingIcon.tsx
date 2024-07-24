// libs
import React from "react";

// models
import { SortingIconProps } from "../models";
import { SortingWay } from "../../../../shared/models/common";

// components
import { ArrowDownIcon, ArrowUpIcon, ArrowsUpDownIcon } from "@heroicons/react/20/solid";

const SortingIcon = ({ sortDirection }: SortingIconProps) => {
    switch (sortDirection) {
        case SortingWay.ASC:
            return <ArrowDownIcon data-testid={`sort-icon-${sortDirection}`} className="w-4 h-4" />;
        case SortingWay.DESC:
            return <ArrowUpIcon data-testid={`sort-icon-${sortDirection}`} className="w-4 h-4" />;
        default:
            return <ArrowsUpDownIcon data-testid={`sort-icon-${sortDirection}`} className="w-4 h-4" />;
    }
};

export default React.memo(SortingIcon);
