// libs
import { Fragment, useCallback, useEffect, useMemo } from "react";
import {
    flexRender,
    getCoreRowModel,
    getExpandedRowModel,
    OnChangeFn,
    useReactTable,
    PaginationState,
    RowSelectionState,
    SortingState,
    Updater,
} from "@tanstack/react-table";
import { useQuery } from "react-query";
import { parse, stringify } from "query-string";
import { useRouter } from "next/router";
import { observer } from "mobx-react";
import debounce from "lodash/debounce";

// stores
import { useTableStore } from "./store";

// helpers
import { getColumnStyles, getHeaderColumnSize } from "./utils";
import { getDynamicQueryObject, getRouteHash } from "../../shared/utils/routing";

// models
import { TableProps } from "./models";

// constants
import { DEFAULT_DEBOUNCE_TIME } from "../../modules/Workplace/constants";

// components
import TableLoading from "./components/TableLoading/TableLoading";
import TableNoRows from "./components/TableNoRows/TableNoRows";
import TablePagination from "./components/TablePagination/TablePagination";
import TableSortingIcons from "./components/TableSortingIcons/TableSortingIcons";

function Table<TRow>({
    tableName,
    columns,
    renderSubComponent,
    filters = "",
    summary,
    fetchCallback,
    onError,
    showPagination = true,
    onRowSelectionChange,
    onSortingChange,
    getRowCanExpand = () => true,
    getIsRowExpanded,
    getRowClassName,
    isFetchEnabled = true,
}: TableProps<TRow>) {
    const { replace, query, route, asPath } = useRouter();
    const {
        tableStore: {
            totalPages,
            setupTotalPages,
            setupActiveFilters,
            rowSelection,
            setupRowSelection,
            pageIndex,
            pageSize,
            setupPageIndex,
            setupPageSize,
            sorting,
            setupSorting,
            getActivePageIndexWithFilters,
            setupPageByQueryParameter,
            cleanup,
        },
    } = useTableStore();

    const queryKey = useMemo(
        () => [tableName, getActivePageIndexWithFilters(filters), pageSize, filters],
        [tableName, pageSize, filters, pageIndex]
    );

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    );

    const debounceSortingChange = useMemo(() => {
        if (onSortingChange) {
            return debounce(onSortingChange, DEFAULT_DEBOUNCE_TIME, { leading: true });
        }

        return null;
    }, [onSortingChange]);

    const { data = { total: 0, data: [] as TRow[] }, isFetching } = useQuery(
        queryKey,
        () => fetchCallback(queryKey, getActivePageIndexWithFilters(filters) + 1, pageSize),
        {
            enabled: isFetchEnabled,
            select: queryData => queryData,
            onSuccess(successData) {
                const activePageIndex = getActivePageIndexWithFilters(filters);

                const totalPagesCount = successData.total ? Math.ceil(successData.total / pageSize) : 0;
                setupTotalPages(totalPagesCount);

                const isCurrentPageValid = totalPagesCount >= activePageIndex + 1;
                const validActivePageIndex = isCurrentPageValid ? activePageIndex : 0;

                const pageQuery = showPagination ? { page: validActivePageIndex + 1 } : {};
                const routeQueries = getDynamicQueryObject(query, route);
                const hash = getRouteHash(asPath);
                const filterQueries = parse(filters, {
                    arrayFormat: "bracket",
                });
                const stringifyQuery = stringify(
                    {
                        ...filterQueries,
                        ...pageQuery,
                        ...routeQueries,
                    },
                    {
                        arrayFormat: "bracket",
                    }
                );

                replace({ query: stringifyQuery, hash }, undefined, {
                    shallow: true,
                });

                setupPageIndex(validActivePageIndex);
                setupActiveFilters(filters);
            },
            onError,
            refetchOnWindowFocus: false,
            keepPreviousData: true,
        }
    );

    useEffect(() => {
        isFetchEnabled && setupActiveFilters(filters);
    }, [isFetchEnabled]);

    useEffect(() => {
        setupPageByQueryParameter(query.page);
    }, [query.page]);

    useEffect(() => () => cleanup(), []);

    const onSortingChangeCallback = useCallback<OnChangeFn<SortingState>>(
        callback => {
            if (typeof callback === "function") {
                if (debounceSortingChange) {
                    debounceSortingChange(callback(sorting));
                }
                return setupSorting(callback(sorting));
            }

            return setupSorting;
        },
        [debounceSortingChange, sorting]
    );

    const onRowSelectionChangeCallback = useCallback<OnChangeFn<RowSelectionState>>(
        callback => {
            if (typeof callback === "function") {
                if (onRowSelectionChange) {
                    onRowSelectionChange(callback(rowSelection));
                }
                return setupRowSelection(callback(rowSelection));
            }

            return setupRowSelection;
        },
        [onRowSelectionChange, rowSelection]
    );

    const setPagination = (prev: Updater<PaginationState>) => {
        const nextPagination = typeof prev === "function" ? prev(pagination) : prev;
        setupPageIndex(nextPagination.pageIndex);
        setupPageSize(nextPagination.pageSize);
    };

    const table = useReactTable({
        data: data.data,
        pageCount: totalPages,
        columns,
        getRowCanExpand,
        state: {
            rowSelection,
            pagination,
            sorting,
        },
        onSortingChange: onSortingChangeCallback,
        enableSorting: Boolean(onSortingChange),
        onRowSelectionChange: onRowSelectionChangeCallback,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onPaginationChange: setPagination,
        getIsRowExpanded,
        manualPagination: true,
        autoResetPageIndex: false,
        autoResetExpanded: true,
    });

    const isTableDataAvailable = useMemo(() => data.data.length && !isFetching, [data.data.length, isFetching]);
    const tableClassName = useMemo(
        () =>
            isFetching || !isTableDataAvailable
                ? "grid-rows-2"
                : "row-start-1 col-start-1 row-end-auto col-end-auto auto-rows-min",
        [isFetching, isTableDataAvailable]
    );

    return (
        <div className="w-full h-full grid grid-rows-frAuto overflow-hidden px-6 text-md pt-6">
            <div className="overflow-hidden">
                <table aria-label={tableName} className={`grid ${tableClassName} w-full h-full overflow-y-scroll`}>
                    <thead className="block text-dark-600 uppercase text-xs font-semibold sticky top-0 bg-light-200 z-10">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr
                                key={headerGroup.id}
                                className="flex w-full pb-3 sticky top-0 border-b border-inset border-dark-400 pl-2"
                            >
                                {headerGroup.headers.map(header => (
                                    <th
                                        key={header.id}
                                        className="w-full grow basis-0 shrink-0 text-left truncate group/sortIcon"
                                        style={{
                                            ...getHeaderColumnSize(header.column, columns),
                                        }}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className: header.column.getCanSort()
                                                        ? "cursor-pointer select-none flex gap-1 items-center"
                                                        : "",
                                                    onClick: header.column.getToggleSortingHandler(),
                                                }}
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                <TableSortingIcons
                                                    isSortingEnable={header.column.getCanSort()}
                                                    sortDirection={header.column.getIsSorted()}
                                                />
                                            </div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="block w-full h-tableBody">
                        {!data.data.length && !isFetching && isFetchEnabled && <TableNoRows />}
                        {(isFetching || !isFetchEnabled) && <TableLoading />}
                        {!isFetching &&
                            isFetchEnabled &&
                            table.getRowModel().rows.map(row => (
                                <Fragment key={row.id}>
                                    <tr
                                        className={`pl-2 flex items-center border-b border-inset border-dark-400 min-h-14 ${
                                            getRowClassName?.(row) || ""
                                        }`}
                                    >
                                        {row.getVisibleCells().map(cell => {
                                            const { isTruncated = true, className = "" } = cell.column.columnDef;

                                            return (
                                                <td
                                                    key={cell.id}
                                                    className={`w-full p-0 ${
                                                        isTruncated ? "truncate" : ""
                                                    } ${className}`}
                                                    style={{
                                                        ...getColumnStyles(cell.column, columns, row.original),
                                                    }}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                    {renderSubComponent && row.getIsExpanded() && (
                                        <tr className="flex">
                                            <td className="grow shrink-0 p-0" colSpan={row.getVisibleCells().length}>
                                                {renderSubComponent({ row })}
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                    </tbody>
                </table>
            </div>
            {summary}
            {showPagination && (
                <TablePagination table={table} total={data.total} pagination={pagination} isFetching={isFetching} />
            )}
        </div>
    );
}
export default observer(Table);
