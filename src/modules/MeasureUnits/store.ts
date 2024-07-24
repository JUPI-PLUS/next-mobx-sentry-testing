// libs
import { action, computed, makeObservable, observable } from "mobx";
import { createContext, useContext } from "react";
import { stringify } from "query-string";
import isEmpty from "lodash/isEmpty";
import { SortingState } from "@tanstack/react-table";

// services
import { TableService } from "../../shared/services/TableService";

// helpers
import { getTransformedQueries, getTransformedSortingQueries } from "../../shared/utils/routing";

// models
import { QueryKey } from "react-query/types/core/types";
import { MeasureUnitAction, MeasureUnitsFilters } from "./models";
import { SortingWay } from "../../shared/models/common";
import { SortingFieldsType } from "../../shared/models/routing";

// constants
import { DEFAULT_MEASURE_UNITS_FILTER_FIELDS_TYPES, DEFAULT_MEASURE_UNITS_FILTER_VALUES } from "./constants";
import { MeasureUnit } from "../../shared/models/business/measureUnits";

export class MeasureUnitsStore {
    @observable private _measureUnitsFilters: MeasureUnitsFilters = DEFAULT_MEASURE_UNITS_FILTER_VALUES;
    @observable private _lastRequestedQueryKey: QueryKey = [];
    @observable private _measureUnit: MeasureUnit | null = null;
    @observable private _measureUnitAction: MeasureUnitAction | null = null;
    @observable private _measureUnitsSorting: SortingFieldsType | null = null;
    tableService: TableService;

    constructor() {
        this.tableService = new TableService();
        makeObservable(this);
    }

    @action.bound
    private onRouteChangeComplete() {
        this.setupMeasureUnitsFilterFromQueries(window.location.search);
    }

    @action.bound
    initialize() {
        this.tableService.subscribeToRouterEvents(this.onRouteChangeComplete);
    }

    @action.bound
    cleanup() {
        this.tableService.unsubscribeRouterEvents(this.onRouteChangeComplete);
    }

    @action.bound
    setupMeasureUnitsFilter(name: keyof MeasureUnitsFilters, value: string) {
        this._measureUnitsFilters[name] = value as string;
    }

    @action.bound
    resetMeasureUnitsFilter() {
        this._measureUnitsFilters = DEFAULT_MEASURE_UNITS_FILTER_VALUES;
        this._measureUnitsSorting = null;
    }

    @action.bound
    setupMeasureUnit(measureUnit: MeasureUnit) {
        this._measureUnit = measureUnit;
    }

    @action.bound
    setupMeasureUnitAction(measureUnitAction: MeasureUnitAction) {
        this._measureUnitAction = measureUnitAction;
    }

    @action.bound
    setupLastRequestedQueryKey(queryKey: QueryKey) {
        this._lastRequestedQueryKey = queryKey;
    }

    @action.bound
    cleanupSelectedMeasureUnit() {
        this._measureUnit = null;
        this._measureUnitAction = null;
    }

    @action.bound
    setupMeasureUnitsFilterFromQueries(queryString: string) {
        const transformedQueries = getTransformedQueries(queryString, DEFAULT_MEASURE_UNITS_FILTER_FIELDS_TYPES);
        const nextFilters = { ...this._measureUnitsFilters, ...transformedQueries };
        this._measureUnitsFilters = nextFilters;

        const transformedSortingQueries = {
            ...this._measureUnitsSorting,
            ...getTransformedSortingQueries(queryString),
        };
        const nextSorting = isEmpty(transformedSortingQueries)
            ? null
            : (transformedSortingQueries as SortingFieldsType);
        this._measureUnitsSorting = nextSorting;

        this.tableService.setupAreFiltersInitialized(true);
        return stringify({ ...nextFilters, ...nextSorting }, { skipNull: true, skipEmptyString: true });
    }

    @action.bound
    setupMeasureUnitsSorting(state: SortingState) {
        if (isEmpty(state)) {
            this._measureUnitsSorting = null;
        } else {
            this._measureUnitsSorting = {
                order_by: state[0].id,
                order_way: state[0].desc ? SortingWay.DESC : SortingWay.ASC,
            };
        }
    }

    @computed
    get lastRequestedQueryKey() {
        return this._lastRequestedQueryKey;
    }

    @computed
    get measureUnit() {
        return this._measureUnit;
    }

    @computed
    get measureUnitAction() {
        return this._measureUnitAction;
    }

    @computed
    get measureUnitsFilters() {
        return this._measureUnitsFilters;
    }

    @computed
    get measureUnitsFiltersQueryString() {
        return stringify(
            { ...this._measureUnitsFilters, ...this._measureUnitsSorting },
            { skipEmptyString: true, skipNull: true }
        );
    }
}

export const MeasureUnitsStoreContext = createContext({
    measureUnitsStore: new MeasureUnitsStore(),
});

interface MeasureUnitsStoreContextValue {
    measureUnitsStore: MeasureUnitsStore;
}

export const useMeasureUnitsStore = (): MeasureUnitsStoreContextValue => useContext(MeasureUnitsStoreContext);
