// libs
import React, { useCallback, useEffect } from "react";
import { observer } from "mobx-react";
import { QueryKey } from "react-query/types/core/types";

// stores
import { useParameterOptionsStore } from "../../store";
import { useTableStore } from "../../../../components/Table/store";

// api
import { listOfParameterOptions } from "../../../../api/parameterOptions";

// models
import { CustomColumn } from "../../../../components/Table/models";
import { ServerResponseType } from "../../../../shared/models/axios";
import { ParameterOption } from "./models";

// components
import Table from "../../../../components/Table";
import ActionCell from "../Cells/ActionCell/ActionCell";
import TextCell from "../../../../components/Table/components/TextCell/TextCell";

const columns: CustomColumn<ParameterOption>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <TextCell text={row.original.name} />,
    },
    {
        id: "action",
        maxWidth: 80,
        cell: ({ row }) => <ActionCell row={row} />,
    },
];

const ParameterOptionsTable = () => {
    const {
        parameterOptionsStore: {
            parameterOptionsFiltersQueryString,
            setupLastRequestedQueryKey,
            setupParameterOptionsFilterFromQueries,
            resetParameterOptionsFilters,
            tableService: { areFiltersInitialized },
        },
    } = useParameterOptionsStore();

    const {
        tableStore: { setupActiveFilters },
    } = useTableStore();

    useEffect(() => {
        const parsedQueries = setupParameterOptionsFilterFromQueries(window.location.search);
        setupActiveFilters(parsedQueries);
    }, []);

    const fetchCallback = useCallback(
        async (queryKey: QueryKey, page: number): Promise<ServerResponseType<ParameterOption, "list">> => {
            const response = await listOfParameterOptions(page, parameterOptionsFiltersQueryString);
            setupLastRequestedQueryKey(queryKey);

            return response.data;
        },
        [parameterOptionsFiltersQueryString]
    );

    return (
        <Table
            columns={columns}
            tableName="parameter-options"
            fetchCallback={fetchCallback}
            onError={resetParameterOptionsFilters}
            filters={parameterOptionsFiltersQueryString}
            isFetchEnabled={areFiltersInitialized}
        />
    );
};

export default observer(ParameterOptionsTable);
