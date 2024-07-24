import { ColumnDef, OnChangeFn, SortDirection } from "@tanstack/react-table";
import { ReactElement, ReactNode } from "react";
import { QueryKey } from "react-query";
import { ServerResponseType } from "../../shared/models/axios";
import { Row, RowSelectionState, SortingState } from "@tanstack/table-core";

export type CellWidth = number | string | undefined;

export type CustomColumn<TData> = ColumnDef<TData, ReactNode> & {
    maxWidth?: ((row?: TData) => CellWidth) | CellWidth;
    minWidth?: ((row?: TData) => CellWidth) | CellWidth;
    className?: string;
};

export type TableProps<TData> = {
    columns: CustomColumn<TData>[];
    tableName: string;
    filters?: string;
    summary?: ReactNode;
    showPagination?: boolean;
    fetchCallback: (queryKey: QueryKey, page: number, perPage: number) => Promise<ServerResponseType<TData, "list">>;
    onError?: () => void;
    renderSubComponent?: (props: { row: Row<TData> }) => ReactElement;
    getIsRowExpanded?: (row: Row<TData>) => boolean;
    getRowCanExpand?: (row: Row<TData>) => boolean;
    onRowSelectionChange?: OnChangeFn<RowSelectionState>;
    onSortingChange?: (state: SortingState) => void;
    getRowClassName?: (row: Row<TData>) => string;
    isFetchEnabled?: boolean;
};

export interface TableSortingIconsProps {
    isSortingEnable: boolean;
    sortDirection: SortDirection | boolean;
}
