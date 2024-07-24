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
import { SampleTypeAction, SampleTypesFilters } from "./models";
import { SampleType } from "../../shared/models/business/sampleTypes";
import { SortingWay } from "../../shared/models/common";
import { SortingFieldsType } from "../../shared/models/routing";

// constants
import { DEFAULT_SAMPLE_TYPES_FILTER_FIELDS_TYPES, DEFAULT_SAMPLE_TYPES_FILTER_VALUES } from "./constants";

export class SampleTypesStore {
    @observable private _sampleTypesFilters: SampleTypesFilters = DEFAULT_SAMPLE_TYPES_FILTER_VALUES;
    @observable private _lastRequestedQueryKey: QueryKey = [];
    @observable private _sampleType: SampleType | null = null;
    @observable private _sampleTypeAction: SampleTypeAction | null = null;
    @observable private _sampleTypesSorting: SortingFieldsType | null = null;
    tableService: TableService;

    constructor() {
        this.tableService = new TableService();
        makeObservable(this);
    }

    @action.bound
    private onRouteChangeComplete() {
        this.setupSampleTypesFilterFromQueries(window.location.search);
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
    setupSampleTypesFilter(name: keyof SampleTypesFilters, value: string) {
        this._sampleTypesFilters[name] = value as string;
    }

    @action.bound
    resetSampleTypesFilter() {
        this._sampleTypesFilters = DEFAULT_SAMPLE_TYPES_FILTER_VALUES;
        this._sampleTypesSorting = null;
    }

    @action.bound
    setupSampleType(sampleType: SampleType) {
        this._sampleType = sampleType;
    }

    @action.bound
    setupSampleTypeAction(sampleTypeAction: SampleTypeAction) {
        this._sampleTypeAction = sampleTypeAction;
    }

    @action.bound
    setupLastRequestedQueryKey(queryKey: QueryKey) {
        this._lastRequestedQueryKey = queryKey;
    }

    @action.bound
    cleanupSelectedSampleType() {
        this._sampleType = null;
        this._sampleTypeAction = null;
    }

    @action.bound
    setupSampleTypesFilterFromQueries(queryString: string) {
        const transformedQueries = getTransformedQueries(queryString, DEFAULT_SAMPLE_TYPES_FILTER_FIELDS_TYPES);
        const nextFilters = { ...this._sampleTypesFilters, ...transformedQueries };
        this._sampleTypesFilters = nextFilters;

        const transformedSortingQueries = { ...this._sampleTypesSorting, ...getTransformedSortingQueries(queryString) };
        const nextSorting = isEmpty(transformedSortingQueries)
            ? null
            : (transformedSortingQueries as SortingFieldsType);
        this._sampleTypesSorting = nextSorting;

        this.tableService.setupAreFiltersInitialized(true);
        return stringify({ ...nextFilters, ...nextSorting }, { skipNull: true, skipEmptyString: true });
    }

    @action.bound
    setupSampleTypesSorting(state: SortingState) {
        if (isEmpty(state)) {
            this._sampleTypesSorting = null;
        } else {
            this._sampleTypesSorting = {
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
    get sampleType() {
        return this._sampleType;
    }

    @computed
    get sampleTypeAction() {
        return this._sampleTypeAction;
    }

    @computed
    get sampleTypesFilters() {
        return this._sampleTypesFilters;
    }

    @computed
    get sampleTypesFiltersQueryString() {
        return stringify(
            { ...this._sampleTypesFilters, ...this._sampleTypesSorting },
            { skipEmptyString: true, skipNull: true }
        );
    }
}

export const SampleTypesStoreContext = createContext({
    sampleTypesStore: new SampleTypesStore(),
});

interface SampleTypesStoreContextValue {
    sampleTypesStore: SampleTypesStore;
}

export const useSampleTypesStore = (): SampleTypesStoreContextValue => useContext(SampleTypesStoreContext);
