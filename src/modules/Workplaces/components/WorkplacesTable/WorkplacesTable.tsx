// libs
import React, { useCallback, useEffect } from "react";
import { observer } from "mobx-react";
import { QueryKey } from "react-query/types/core/types";

// stores
import { useWorkplacesStore } from "../../store";
import { useTableStore } from "../../../../components/Table/store";

// helpers
import { getWorkplacesList } from "../../../../api/workplaces";

// models
import { ServerResponseType } from "../../../../shared/models/axios";
import { CustomColumn } from "../../../../components/Table/models";
import { Workplace } from "../../../../shared/models/business/workplace";

// components
import Table from "../../../../components/Table";
import ActionsCell from "./components/ActionsCell/ActionsCell";
import DeleteWorkplaceDialogs from "./components/DeleteWorkplaceDialogs/DeleteWorkplaceDialogs";
import TextCell from "../../../../components/Table/components/TextCell/TextCell";

const WorkplacesTable = () => {
    const {
        workplacesStore: {
            selectedWorkplace,
            workplacesFiltersQueryString,
            setupLastRequestedQueryKey,
            setupSelectedWorkplace,
            setupWorkplacesFilterFromQueries,
            resetWorkplacesFilters,
            setupWorkplacesSorting,
            tableService: { areFiltersInitialized },
        },
    } = useWorkplacesStore();

    const {
        tableStore: { setupActiveFilters },
    } = useTableStore();

    const columns: CustomColumn<Workplace>[] = [
        {
            id: "name",
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <TextCell text={row.original.name} />,
        },
        {
            id: "code",
            accessorKey: "code",
            header: "Code",
        },
        {
            id: "actions",
            maxWidth: 80,
            cell: ({ row }) => (
                <ActionsCell row={row.original} onDeleteWorkplace={() => setupSelectedWorkplace(row.original)} />
            ),
        },
    ];

    useEffect(() => {
        const parsedQueries = setupWorkplacesFilterFromQueries(window.location.search);
        setupActiveFilters(parsedQueries);
    }, []);

    const fetchCallback = useCallback(
        async (queryKey: QueryKey, page: number): Promise<ServerResponseType<Workplace, "list">> => {
            const response = await getWorkplacesList(page, workplacesFiltersQueryString);
            setupLastRequestedQueryKey(queryKey);
            return response.data;
        },
        [workplacesFiltersQueryString]
    );

    return (
        <div className="flex flex-col w-full h-full bg-white rounded-md shadow-card-shadow">
            <Table<Workplace>
                tableName="workplaces"
                fetchCallback={fetchCallback}
                filters={workplacesFiltersQueryString}
                columns={columns}
                onSortingChange={setupWorkplacesSorting}
                onError={resetWorkplacesFilters}
                isFetchEnabled={areFiltersInitialized}
            />
            {Boolean(selectedWorkplace) && <DeleteWorkplaceDialogs />}
        </div>
    );
};

export default observer(WorkplacesTable);
