// libs
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

// helpers
import { getColumnStyles, getHeaderColumnSize } from "../../../../components/Table/utils";

// models
import { TableProps } from "./models";

function Table<TRow>({ tableName, data = [], columns, containerClassName = "" }: TableProps<TRow>) {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (!data.length) return null;

    return (
        <div className={`w-full grid grid-rows-frAuto overflow-hidden text-md ${containerClassName}`}>
            <div className="overflow-hidden">
                <table
                    aria-label={tableName}
                    className="grid row-start-1 col-start-1 row-end-auto col-end-auto auto-rows-min w-full h-full overflow-y-auto"
                >
                    <thead className="block text-dark-600 uppercase text-xs font-semibold sticky top-0 bg-light-200 z-10">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr
                                key={headerGroup.id}
                                className="pl-3 flex w-full pb-3 sticky top-0 border-b border-inset border-dark-400"
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
                                            <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                                        )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody className="block w-full h-tableBody">
                        {table.getRowModel().rows.map(row => (
                            <tr
                                key={row.id}
                                className="pl-3 flex items-center border-b border-inset border-dark-400 min-h-14"
                            >
                                {row.getVisibleCells().map(cell => {
                                    const { isTruncated = true, className = "" } = cell.column.columnDef;
                                    return (
                                        <td
                                            key={cell.id}
                                            className={`w-full p-0 ${isTruncated ? "truncate" : ""} ${className}`}
                                            style={{
                                                ...getColumnStyles(cell.column, columns, row.original),
                                            }}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default Table;
