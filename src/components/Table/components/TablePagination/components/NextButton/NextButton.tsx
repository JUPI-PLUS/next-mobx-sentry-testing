// libs
import React, { FC } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

// components
import { IconButton } from "../../../../../uiKit/Button/Button";

// models
import { PaginationNextPageProps } from "../../models";

// helpers
import { paginate } from "../../../../utils";

const NextButton: FC<PaginationNextPageProps> = ({ total, perPage, page, onPageChange, isLoading, disabled }) => {
    const { totalPages } = paginate(total, page, perPage);
    const isDisabled = page === totalPages || isLoading || disabled;

    const onPaginationPageChange = () => {
        onPageChange(page + 1);
    };

    return (
        <IconButton
            onClick={onPaginationPageChange}
            disabled={isDisabled}
            data-testid="pagination-next-button"
            className="p-3 hover:bg-dark-400"
            aria-label="Next page"
            aria-disabled={isDisabled}
        >
            <ChevronRightIcon className="w-4 h-4 text-black" />
        </IconButton>
    );
};

export default React.memo(NextButton);
