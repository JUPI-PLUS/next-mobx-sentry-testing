// libs
import React, { FC } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

// models
import { PaginationPreviousPageProps } from "../../models";

// components
import { IconButton } from "../../../../../uiKit/Button/Button";

const PreviousButton: FC<PaginationPreviousPageProps> = ({ page, isLoading, onPageChange, disabled }) => {
    const isDisabled = page === 0 || isLoading || disabled;

    const onPaginationPageChange = () => {
        onPageChange(page - 1);
    };

    return (
        <IconButton
            onClick={onPaginationPageChange}
            disabled={isDisabled}
            data-testid="pagination-previous-button"
            className="p-3 hover:bg-dark-400"
            aria-label="Previous page"
        >
            <ChevronLeftIcon className="w-4 h-4 text-black" />
        </IconButton>
    );
};

export default React.memo(PreviousButton);
