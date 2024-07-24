import { Column } from "@tanstack/table-core";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { CellWidth, CustomColumn } from "./models";
import { DEFAULT_COLUMN_WIDTH } from "./constants";

const findColumnDefinition = <TRow>(columnId: string, columns: CustomColumn<TRow>[]) => {
    return columns.find(({ id }) => columnId === id);
};

const getColumnWidth = <TRow>(widthAttribute: ((row?: TRow) => CellWidth) | CellWidth, row?: TRow) => {
    if (typeof widthAttribute === "function") {
        return widthAttribute(row);
    }

    return widthAttribute;
};

export const getColumnStyles = <TRow>(
    column: Column<TRow, unknown>,
    columns: ColumnDef<TRow, React.ReactNode>[],
    row: TRow
): { minWidth?: CellWidth; maxWidth?: CellWidth } => {
    const foundColumn = findColumnDefinition(column.id, columns);

    if (!foundColumn) {
        return {};
    }

    return { minWidth: getColumnWidth(foundColumn.minWidth, row), maxWidth: getColumnWidth(foundColumn.maxWidth, row) };
};

export const getHeaderColumnSize = <TRow>(
    column: Column<TRow, unknown>,
    columns: ColumnDef<TRow, React.ReactNode>[]
) => {
    const foundColumn = findColumnDefinition(column.id, columns);

    if (!foundColumn) {
        const size = column.getSize();
        return { minWidth: size, maxWidth: size };
    }

    return { minWidth: getColumnWidth(foundColumn.minWidth), maxWidth: getColumnWidth(foundColumn.maxWidth) };
};

export const getDefaultColumnSize = <TRow>(
    column: Column<TRow, unknown>,
    columns: ColumnDef<TRow, React.ReactNode>[]
) => {
    const foundColumn = findColumnDefinition(column.id, columns);

    if (!foundColumn) {
        return column.getSize();
    }

    if (!foundColumn.size && !foundColumn.maxSize && !foundColumn.minSize) {
        return DEFAULT_COLUMN_WIDTH;
    }

    return column.getSize();
};

export const getActivePageIndex = (
    prevFilters: string | undefined,
    nextFilters: string | undefined,
    currentPage: number,
    totalPages: number
): number => {
    if (currentPage < 0) return totalPages;
    return prevFilters !== nextFilters ? 0 : currentPage;
};

export function paginate(totalItems: number, currentPage = 1, pageSize = 10, maxPages = 5) {
    // calculate total pages
    const totalPages = Math.ceil(totalItems / pageSize);

    // ensure current page isn't out of range
    if (currentPage < 1) {
        currentPage = 1;
    } else if (currentPage > totalPages) {
        currentPage = totalPages;
    }

    let startPage: number, endPage: number;
    if (totalPages <= maxPages) {
        // total pages less than max so show all pages
        startPage = 1;
        endPage = totalPages;
    } else {
        // total pages more than max so calculate start and end pages
        const maxPagesBeforeCurrentPage = Math.floor(maxPages / 2);
        const maxPagesAfterCurrentPage = Math.ceil(maxPages / 2) - 1;
        if (currentPage <= maxPagesBeforeCurrentPage) {
            // current page near the start
            startPage = 1;
            endPage = maxPages;
        } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
            // current page near the end
            startPage = totalPages - maxPages + 1;
            endPage = totalPages;
        } else {
            // current page somewhere in the middle
            startPage = currentPage - maxPagesBeforeCurrentPage;
            endPage = currentPage + maxPagesAfterCurrentPage;
        }
    }

    // calculate start and end item indexes
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

    // create an array of pages to ng-repeat in the pager control
    const pages = Array.from(Array(endPage + 1 - startPage).keys()).map(i => startPage + i);

    // return object with all pager properties required by the view
    return {
        totalPages,
        startPage,
        endPage,
        startIndex,
        endIndex,
        pages,
    };
}
