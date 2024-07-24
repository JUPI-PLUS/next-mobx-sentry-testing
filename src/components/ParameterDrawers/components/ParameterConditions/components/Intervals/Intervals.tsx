import React, { FC, useMemo, useState } from "react";
import { flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from "@tanstack/react-table";
import { getColumnStyles, getHeaderColumnSize } from "../../../../../Table/utils";
import { CustomColumn } from "../../../../../Table/models";
import ColorCell from "./components/ColorCell/ColorCell";
import NormCell from "./components/NormCell/NormCell";
import { useDisclosure } from "../../../../../../shared/hooks/useDisclosure";
import NotesDialog from "./components/NotesDialog/NotesDialog";
import { IconButton, TextButton } from "../../../../../uiKit/Button/Button";
import DeleteIcon from "../../../../../uiKit/Icons/DeleteIcon";
import { useParameterConditionsStore } from "../../store";
import NotesCell from "./components/NotesCell/NotesCell";
import TitleCell from "./components/TitleCell/TitleCell";
import TitleDialog from "./components/TitleDialog/TitleDialog";
import { observer } from "mobx-react";
import { MAX_INTERVALS_COUNT } from "../../constants";
import { PlusIcon } from "@heroicons/react/20/solid";
import FromCell from "./components/FromCell/FromCell";
import ToCell from "./components/ToCell/ToCell";
import isNumber from "lodash/isNumber";
import { IntervalsProps } from "./models";

const Intervals: FC<IntervalsProps> = ({ index: conditionGroupIndex }) => {
    const {
        parameterConditionsStore: {
            conditionGroups,
            disabledIntervals,
            addIntervalRow,
            deleteIntervalRow,
            revalidateDisabledIntervals,
        },
    } = useParameterConditionsStore();
    // Cause I need here table I create this state to control row count. All logic in cells
    const [tableData, setTableData] = useState(() => conditionGroups[conditionGroupIndex].values.map(() => ""));
    const [rowIndex, setRowIndex] = useState<number | null>(null);
    const { isOpen: isNotesDialogOpen, onOpen: onNotesDialogOpen, onClose: onNotesDialogClose } = useDisclosure();
    const { isOpen: isTitleDialogOpen, onOpen: onTitleDialogOpen, onClose: onTitleDialogClose } = useDisclosure();

    const onEditNotesDialogOpen = (tableRowIndex: number) => {
        onNotesDialogOpen();
        setRowIndex(tableRowIndex);
    };

    const onEditNotesDialogClose = () => {
        onNotesDialogClose();
        setRowIndex(null);
    };

    const onEditTitleDialogOpen = (tableRowIndex: number) => {
        onTitleDialogOpen();
        setRowIndex(tableRowIndex);
    };

    const onEditTitleDialogClose = () => {
        onTitleDialogClose();
        setRowIndex(null);
    };

    const onDeleteRow = (index: number) => {
        const start = tableData.slice(0, index);
        const end = tableData.slice(index + 1);
        setTableData([...start, ...end]);
        deleteIntervalRow(conditionGroupIndex, index);
        revalidateDisabledIntervals(conditionGroupIndex);
    };

    const columns: CustomColumn<string>[] = useMemo(
        () => [
            {
                id: "from",
                accessorKey: "from",
                header: "From ( > )",
                cell: ({ row }) => <FromCell conditionGroupIndex={conditionGroupIndex} rowIndex={row.index} />,
            },
            {
                id: "to",
                accessorKey: "to",
                header: "To ( <= )",
                cell: ({ row }) => <ToCell conditionGroupIndex={conditionGroupIndex} rowIndex={row.index} />,
            },
            {
                id: "Color",
                accessorKey: "color",
                header: "Color",
                cell: ({ row }) => <ColorCell conditionGroupIndex={conditionGroupIndex} rowIndex={row.index} />,
            },
            {
                id: "title",
                accessorKey: "title",
                header: "Title",
                cell: ({ row }) => (
                    <TitleCell
                        onClick={() => onEditTitleDialogOpen(row.index)}
                        conditionGroupIndex={conditionGroupIndex}
                        rowIndex={row.index}
                    />
                ),
            },
            {
                id: "note",
                accessorKey: "note",
                header: "Note",
                cell: ({ row }) => (
                    <NotesCell
                        onClick={() => onEditNotesDialogOpen(row.index)}
                        conditionGroupIndex={conditionGroupIndex}
                        rowIndex={row.index}
                    />
                ),
            },
            {
                id: "norm",
                accessorKey: "norm",
                header: "Norm",
                maxWidth: 50,
                cell: ({ row }) => <NormCell conditionGroupIndex={conditionGroupIndex} rowIndex={row.index} />,
            },
            {
                id: "actions",
                maxWidth: 40,
                cell: ({ row }) =>
                    tableData.length > 1 && (
                        <IconButton
                            size="thin"
                            variant="transparent"
                            className="self-end justify-self-center mx-auto"
                            type="button"
                            onClick={() => onDeleteRow(row.index)}
                        >
                            <DeleteIcon className="fill-dark-700" />
                        </IconButton>
                    ),
            },
        ],
        [conditionGroupIndex, tableData.length]
    );

    const table = useReactTable({
        data: tableData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
    });

    const isRowIndexDefined = rowIndex !== null;

    const isEditTitleDialogOpen = isRowIndexDefined && isTitleDialogOpen;
    const isEditNoteDialogOpen = isRowIndexDefined && isNotesDialogOpen;

    const isDisabledIntervalsExists = disabledIntervals.has(conditionGroupIndex);
    const isLastIntervalValueExists =
        isNumber(conditionGroups[conditionGroupIndex].values.at(-1)?.to) &&
        isNumber(conditionGroups[conditionGroupIndex].values.at(-1)?.from);

    return (
        <>
            <table className="block w-full h-full text-sm">
                <thead className="block text-dark-600 uppercase text-xs font-semibold">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr
                            key={headerGroup.id}
                            className="flex w-full pt-6 pb-3 sticky top-0 border-b border-inset border-dark-400"
                        >
                            {headerGroup.headers.map(header => (
                                <th
                                    key={header.id}
                                    className="w-full grow basis-0 shrink-0 text-left truncate"
                                    style={{
                                        ...getHeaderColumnSize(header.column, columns),
                                    }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody className="block w-full h-tableBody">
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className="flex items-center border-b border-inset border-dark-400 min-h-10">
                            {row.getVisibleCells().map(cell => {
                                return (
                                    <td
                                        key={cell.id}
                                        className="w-full p-0 truncate"
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
            {isEditNoteDialogOpen && (
                <NotesDialog
                    onClose={onEditNotesDialogClose}
                    rowIndex={rowIndex}
                    conditionGroupIndex={conditionGroupIndex}
                />
            )}
            {isEditTitleDialogOpen && (
                <TitleDialog
                    onClose={onEditTitleDialogClose}
                    rowIndex={rowIndex}
                    conditionGroupIndex={conditionGroupIndex}
                />
            )}
            {tableData.length < MAX_INTERVALS_COUNT && (
                <TextButton
                    text="Add range"
                    type="button"
                    size="thin"
                    variant="neutral"
                    className="text-brand-100 font-medium mt-4"
                    disabled={isDisabledIntervalsExists || !isLastIntervalValueExists}
                    startIcon={<PlusIcon className="w-5 h-5" />}
                    onClick={() => {
                        addIntervalRow(conditionGroupIndex);
                        setTableData(prevState => [...prevState, ""]);
                    }}
                />
            )}
        </>
    );
};

export default observer(Intervals);
