import React, { useMemo } from "react";
import { Cell, flexRender } from "@tanstack/react-table";

const TableCell = <T,>({ cell }: { cell: Cell<T, unknown> }) => {
    const width = useMemo(() => cell.column.getSize(), [cell.column]);
    return <td style={{ width }}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
};

export default React.memo(TableCell);
