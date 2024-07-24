export interface PaginationProps {
    isLoading: boolean;
    total: number;
    page: number;
    perPage: number;
    onPageChange: (next: number) => void;
}

export type PaginationPerPageDropdownProps = Pick<PaginationProps, "perPage" | "isLoading">;
export type PaginationPageCounterProps = Pick<PaginationProps, "total" | "page" | "perPage">;
export type PaginationPreviousPageProps = Pick<PaginationProps, "page" | "isLoading" | "onPageChange"> & {
    disabled?: boolean;
};
export type PaginationNextPageProps = Pick<
    PaginationProps,
    "page" | "isLoading" | "onPageChange" | "total" | "perPage"
> & { disabled?: boolean };
export type PaginationEdgePageProps = Omit<PaginationProps, "onPerPageChange">;
