// libs
import React, { useCallback, useEffect } from "react";
import { observer } from "mobx-react";

// helpers
import columns from "./columns";
import { getMeasureUnitsList } from "../../../../api/measureUnits";

// models
import { QueryKey } from "react-query/types/core/types";
import { ServerResponseType } from "../../../../shared/models/axios";

// components
import Table from "../../../../components/Table";

// stores
import { useMeasureUnitsStore } from "../../store";
import { useTableStore } from "../../../../components/Table/store";
import { MeasureUnit } from "../../../../shared/models/business/measureUnits";

const MeasureUnitsTable = () => {
    const {
        measureUnitsStore: {
            measureUnitsFiltersQueryString,
            setupLastRequestedQueryKey,
            setupMeasureUnitsFilterFromQueries,
            resetMeasureUnitsFilter,
            setupMeasureUnitsSorting,
            tableService: { areFiltersInitialized },
        },
    } = useMeasureUnitsStore();

    const {
        tableStore: { setupActiveFilters },
    } = useTableStore();

    useEffect(() => {
        const parsedQueries = setupMeasureUnitsFilterFromQueries(window.location.search);
        setupActiveFilters(parsedQueries);
    }, []);

    const fetchCallback = useCallback(
        async (queryKey: QueryKey, page: number): Promise<ServerResponseType<MeasureUnit, "list">> => {
            const response = await getMeasureUnitsList(page, measureUnitsFiltersQueryString);
            setupLastRequestedQueryKey(queryKey);
            return response.data;
        },
        [measureUnitsFiltersQueryString]
    );

    return (
        <Table
            columns={columns}
            tableName="measure-units"
            fetchCallback={fetchCallback}
            onError={resetMeasureUnitsFilter}
            onSortingChange={setupMeasureUnitsSorting}
            filters={measureUnitsFiltersQueryString}
            isFetchEnabled={areFiltersInitialized}
        />
    );
};

export default observer(MeasureUnitsTable);
