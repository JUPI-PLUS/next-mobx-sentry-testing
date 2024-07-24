// libs
import React, { MouseEvent, useCallback, useMemo } from "react";
import { observer } from "mobx-react";
import { useQuery } from "react-query";
import { useRouter } from "next/router";
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";

// stores
import { useTemplatesStore } from "../../store";
import { useContextMenuStore } from "./components/ContextMenu/store";

// helpers
import { getParentsOfTemplate, getListOfTemplates } from "../../../../api/templates";
import { getColumnStyles, getHeaderColumnSize } from "../../../../components/Table/utils";
import { getUuidFromDataset } from "./utils";
import { getSampleTypes } from "../../../../api/dictionaries";
import { toLookupList } from "../../../../shared/utils/lookups";

// constants
import { DICTIONARIES_QUERY_KEYS, TEMPLATES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";
import { getColumns } from "./columns";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";

// components
import TableNoRows from "../../../../components/Table/components/TableNoRows/TableNoRows";
import TableLoading from "../../../../components/Table/components/TableLoading/TableLoading";
import FolderPath from "./components/FolderPath/FolderPath";
import CutItemDetails from "./components/CutItemDetails/CutItemDetails";

const TemplateTable = () => {
    const {
        templatesStore: {
            parentGroupUUID,
            cutItemDetails,
            isMoveInFolderAction,
            templatesFiltersQueryString,
            addResetCount,
            setupNestedLvl,
            setupParentGroupUUID,
            setupCurrentFolderUUID,
            cleanupParentGroupUUID,
            cleanupCurrentFolderUUID,
            getTemplatesQuery,
            cleanupTemplatesFilters,
            setupIsMoveToFolder,
        },
    } = useTemplatesStore();
    const {
        contextMenuStore: { setupContextMenuTemplate, setupContextMenuPosition },
    } = useContextMenuStore();
    const {
        query: { folder },
        replace,
    } = useRouter();

    const templatesQuery = useMemo(() => getTemplatesQuery(folder || null), [templatesFiltersQueryString, folder]);

    const { data: templatesList = [], isFetching: isTemplatesListFetching } = useQuery(
        TEMPLATES_QUERY_KEYS.LIST(templatesQuery),
        // TODO: research how to handle it
        () => getListOfTemplates(templatesQuery),
        {
            select: queryData => queryData.data.data,
            onError: () => {
                cleanupParentGroupUUID();
                cleanupCurrentFolderUUID();
                replace({});
            },
            onSuccess: () => {
                if (folder && !Array.isArray(folder)) {
                    setupParentGroupUUID(folder);
                    setupCurrentFolderUUID(folder);
                } else {
                    cleanupParentGroupUUID();
                    cleanupCurrentFolderUUID();
                    setupNestedLvl(0);
                }
            },
            onSettled: () => {
                if (isMoveInFolderAction) {
                    cleanupTemplatesFilters();
                    addResetCount();
                    setupIsMoveToFolder(false);
                }
            },
        }
    );

    const { data: templateParents = [], isFetching: isTemplateParentsFetching } = useQuery(
        TEMPLATES_QUERY_KEYS.PARENTS(parentGroupUUID!),
        () => getParentsOfTemplate(parentGroupUUID!),
        {
            select: queryData => queryData.data.data,
            enabled: parentGroupUUID === folder,
            onSuccess: queryData => {
                setupNestedLvl(queryData.length);
            },
        }
    );

    const { data: sampleTypesLookup = [], isFetching: isSampleTypesLookupFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.SAMPLE_TYPES,
        getSampleTypes,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const onRowContextMenuClick = useCallback(
        (event: MouseEvent<HTMLElement>) => {
            if (!templatesList.length || cutItemDetails) return;

            event.preventDefault();
            const rowUuid = getUuidFromDataset(event.target as HTMLElement);

            if (!rowUuid) return;

            const template = templatesList.find(({ uuid }) => rowUuid === uuid)!;
            const { clientX, clientY } = event;

            setupContextMenuPosition(clientX, clientY);
            setupContextMenuTemplate(template);
        },
        [cutItemDetails, templatesList.length]
    );

    const isCutItemInParent = useMemo(
        () => templateParents.some(templateParent => templateParent.uuid === cutItemDetails?.uuid),
        [cutItemDetails?.uuid, templateParents]
    );

    const columns = useMemo(
        () => getColumns(isCutItemInParent, sampleTypesLookup),
        [isCutItemInParent, isSampleTypesLookupFetching]
    );

    const table = useReactTable({
        data: templatesList,
        columns,
        manualPagination: true,
        autoResetPageIndex: false,
        autoResetExpanded: true,
        getCoreRowModel: getCoreRowModel(),
    });

    const isTemplatesListEmpty = useMemo(
        () => (!templatesList || !templatesList.length) && !isTemplatesListFetching,
        [isTemplatesListFetching, templatesList]
    );

    return (
        <div className="bg-white p-6 h-full rounded-lg flex flex-col overflow-hidden">
            <FolderPath
                isFetching={isTemplatesListFetching || isTemplateParentsFetching}
                templateParents={templateParents}
            />
            <div className="w-full h-full overflow-hidden pt-6">
                <table className="block w-full h-full overflow-y-scroll">
                    <thead className="block text-dark-600 uppercase text-xs font-semibold sticky top-0 bg-light-200 z-10">
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr
                                key={headerGroup.id}
                                className="flex w-full pr-4 pb-3 border-b border-inset border-dark-400 pl-14"
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
                    <tbody className="block w-full h-tableBody" onContextMenu={onRowContextMenuClick}>
                        {isTemplatesListEmpty && <TableNoRows />}
                        {isTemplatesListFetching || isTemplateParentsFetching ? (
                            <TableLoading />
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <tr
                                    key={row.id}
                                    className="pl-2 pr-4 py-4 flex items-center border-b border-inset border-dark-400 min-h-14"
                                    data-uuid={row.original.uuid}
                                    data-testid={row.original.uuid}
                                >
                                    {row.getVisibleCells().map(cell => {
                                        return (
                                            <td
                                                key={cell.id}
                                                className="w-full p-0"
                                                style={{
                                                    ...getColumnStyles(cell.column, columns, row.original),
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
            <CutItemDetails
                templateParents={templateParents}
                isFetching={isTemplateParentsFetching || isTemplatesListFetching}
            />
        </div>
    );
};

export default observer(TemplateTable);
