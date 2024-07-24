// libs
import React, { useCallback, useEffect } from "react";
import { observer } from "mobx-react";
import { QueryKey } from "react-query/types/core/types";

// helpers
import { getParametersList } from "../../../../api/parameters";

// stores
import { useParametersStore } from "../../store";
import { useTableStore } from "../../../../components/Table/store";

// models
import { ServerResponseType } from "../../../../shared/models/axios";
import { Parameter } from "../../../../shared/models/business/parameter";
import { CustomColumn } from "../../../../components/Table/models";

// components
import Table from "../../../../components/Table";
import ActionsCell from "./components/ActionsCell/ActionsCell";
import MeasurementUnitCell from "./components/MeasurementUnitCell/MeasurementUnitCell";
import EditParameterDrawer from "./components/EditParameterDrawer/EditParameterDrawer";
import DeleteParameterDialog from "./components/DeleteParameterDialog/DeleteParameterDialog";
import TextCell from "../../../../components/Table/components/TextCell/TextCell";

const columns: CustomColumn<Parameter>[] = [
    {
        id: "name",
        accessorKey: "name",
        header: "Name",
        maxWidth: 600,
        cell: ({ row }) => <TextCell text={row.original.name} />,
    },
    {
        id: "code",
        accessorKey: "code",
        header: "Code",
    },
    {
        id: "si_measurement_units_id",
        accessorKey: "si_measurement_units_id",
        header: "Measurement units",
        enableSorting: false,
        cell: ({ row }) => <MeasurementUnitCell row={row.original} />,
    },
    {
        id: "actions",
        maxWidth: 80,
        cell: ({ row }) => <ActionsCell row={row.original} />,
    },
];

const ParametersTable = () => {
    const {
        parametersStore: {
            parameterFiltersQueryString,
            setupLastRequestedQueryKey,
            isEditParameterDrawerOpen,
            isDeleteParameterDrawerOpen,
            resetParametersFilters,
            setupParametersFilterFromQueries,
            setupParameterSorting,
            tableService: { areFiltersInitialized },
        },
    } = useParametersStore();

    const {
        tableStore: { setupActiveFilters },
    } = useTableStore();

    useEffect(() => {
        const parsedQueries = setupParametersFilterFromQueries(window.location.search);
        setupActiveFilters(parsedQueries);
    }, []);

    const fetchCallback = useCallback(
        async (queryKey: QueryKey, page: number): Promise<ServerResponseType<Parameter, "list">> => {
            const response = await getParametersList(page, parameterFiltersQueryString);
            setupLastRequestedQueryKey(queryKey);
            return response.data;
        },
        [parameterFiltersQueryString]
    );

    return (
        <div className="flex flex-col w-full h-full bg-white rounded-md shadow-card-shadow">
            <Table<Parameter>
                tableName="parameters"
                fetchCallback={fetchCallback}
                onError={resetParametersFilters}
                filters={parameterFiltersQueryString}
                onSortingChange={setupParameterSorting}
                columns={columns}
                isFetchEnabled={areFiltersInitialized}
            />
            {isEditParameterDrawerOpen && <EditParameterDrawer />}
            {isDeleteParameterDrawerOpen && <DeleteParameterDialog />}
        </div>
    );
};

export default observer(ParametersTable);
