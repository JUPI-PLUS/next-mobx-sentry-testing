// libs
import React, { useCallback, useEffect } from "react";
import { observer } from "mobx-react";

// helpers
import columns from "./columns";
import { getSampleTypesList } from "../../../../api/sampleTypes";

// models
import { QueryKey } from "react-query/types/core/types";
import { ServerResponseType } from "../../../../shared/models/axios";
import { SampleType } from "../../../../shared/models/business/sampleTypes";

// components
import Table from "../../../../components/Table";

// stores
import { useSampleTypesStore } from "../../store";
import { useTableStore } from "../../../../components/Table/store";

const SampleTypesTable = () => {
    const {
        sampleTypesStore: {
            sampleTypesFiltersQueryString,
            setupLastRequestedQueryKey,
            setupSampleTypesFilterFromQueries,
            resetSampleTypesFilter,
            setupSampleTypesSorting,
            tableService: { areFiltersInitialized },
        },
    } = useSampleTypesStore();

    const {
        tableStore: { setupActiveFilters },
    } = useTableStore();

    useEffect(() => {
        const parsedQueries = setupSampleTypesFilterFromQueries(window.location.search);
        setupActiveFilters(parsedQueries);
    }, []);

    const fetchCallback = useCallback(
        async (queryKey: QueryKey, page: number): Promise<ServerResponseType<SampleType, "list">> => {
            const response = await getSampleTypesList(page, sampleTypesFiltersQueryString);
            setupLastRequestedQueryKey(queryKey);
            return response.data;
        },
        [sampleTypesFiltersQueryString]
    );

    return (
        <Table
            columns={columns}
            tableName="sample-types"
            fetchCallback={fetchCallback}
            onError={resetSampleTypesFilter}
            onSortingChange={setupSampleTypesSorting}
            filters={sampleTypesFiltersQueryString}
            isFetchEnabled={areFiltersInitialized}
        />
    );
};

export default observer(SampleTypesTable);
