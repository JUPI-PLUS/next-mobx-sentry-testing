// libs
import React, { FC, useMemo } from "react";

// components
import { SolidButton } from "../../../../../uiKit/Button/Button";
import Dots from "../Dots/Dots";

// helpers
import { paginate } from "../../../../utils";

// models
import { PaginationEdgePageProps } from "../../models";

const PageButtons: FC<PaginationEdgePageProps> = ({ isLoading, perPage, page, total, onPageChange }) => {
    const { pages, endPage, totalPages, startPage } = paginate(total, page, perPage);

    const onPaginationPageChange = (nextPage: number) => {
        onPageChange(nextPage);
    };

    const goToFirstPage = () => {
        onPageChange(0);
    };

    const goToLastPage = () => {
        onPageChange(totalPages - 1);
    };

    const shouldShowEndPageButton = useMemo(() => totalPages - endPage >= 1, [endPage, totalPages]);
    const shouldShowEndDots = useMemo(() => totalPages - endPage >= 1, [endPage, totalPages]);

    const shouldShowStartPageButton = useMemo(() => startPage !== 1, [startPage]);
    const shouldShowStartDots = useMemo(() => startPage >= 3, [startPage]);

    return (
        <>
            {shouldShowStartPageButton && (
                <SolidButton
                    aria-label="Pagination 1 page"
                    variant="primary"
                    text="1"
                    onClick={goToFirstPage}
                    disabled={isLoading}
                    data-testid="pagination-start-button"
                    size="sm"
                    className="justify-center w-10 h-10 text-sm font-medium !text-dark-800 ring-1 ring-dark-500 !bg-white hover:!bg-dark-400"
                />
            )}
            {shouldShowStartDots && <Dots />}
            {pages.map(number => (
                <SolidButton
                    aria-label={number - 1 === page ? `Current page: ${number}` : `Page: ${number}`}
                    variant="primary"
                    key={number}
                    text={number}
                    disabled={isLoading}
                    size="sm"
                    onClick={() => onPaginationPageChange(number - 1)}
                    data-testid={`pagination-button-${number}`}
                    className={`justify-center w-10 h-10 text-sm font-medium ${
                        number - 1 === page
                            ? "text-dark-900 border-black bg-brand-100"
                            : "ring-1 ring-dark-500 !text-dark-800 !bg-white hover:!bg-dark-400"
                    }`}
                />
            ))}
            {shouldShowEndDots && <Dots />}
            {shouldShowEndPageButton && (
                <SolidButton
                    aria-label="Last page"
                    variant="neutral"
                    text={totalPages}
                    onClick={goToLastPage}
                    disabled={isLoading}
                    data-testid="pagination-last-button"
                    size="sm"
                    className="justify-center w-10 h-10 text-sm font-medium !text-dark-800 ring-1 ring-dark-500 !bg-white hover:!bg-dark-400"
                />
            )}
        </>
    );
};

export default React.memo(PageButtons);
