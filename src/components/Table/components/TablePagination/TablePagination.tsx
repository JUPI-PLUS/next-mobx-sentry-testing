// libs
import React from "react";
import { Table } from "@tanstack/react-table";

// components
import PageButtons from "./components/PageButtons/PageButtons";
import PreviousButton from "./components/PreviousButton/PreviousButton";
import NextButton from "./components/NextButton/NextButton";

const TablePagination = <T,>({
    table,
    pagination,
    total,
    isFetching,
}: {
    table: Table<T>;
    total: number;
    isFetching: boolean;
    pagination: { pageIndex: number; pageSize: number };
}) => {
    const onPageChange = (nextPage: number) => table.setPageIndex(nextPage);

    return (
        <div className="flex py-6 items-center justify-center gap-2 shadow-table-pagination">
            <PreviousButton
                isLoading={isFetching}
                onPageChange={onPageChange}
                page={pagination.pageIndex}
                disabled={!table.getCanPreviousPage()}
            />
            <PageButtons
                page={pagination.pageIndex}
                onPageChange={onPageChange}
                perPage={pagination.pageSize}
                total={total}
                isLoading={isFetching || !total}
            />
            <NextButton
                perPage={pagination.pageSize}
                total={total}
                page={pagination.pageIndex}
                isLoading={isFetching || !total}
                onPageChange={onPageChange}
                disabled={!table.getCanNextPage()}
            />
        </div>
    );
};

export default TablePagination;
