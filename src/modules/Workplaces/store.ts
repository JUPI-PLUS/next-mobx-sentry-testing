// libs
import { createContext, useContext } from "react";
import { action, computed, makeObservable, observable } from "mobx";
import { stringify } from "query-string";
import { QueryKey } from "react-query/types/core/types";
import isEmpty from "lodash/isEmpty";
import { SortingState } from "@tanstack/react-table";

// services
import { TableService } from "../../shared/services/TableService";

// helpers
import { getTransformedQueries, getTransformedSortingQueries } from "../../shared/utils/routing";

// models
import { Lookup } from "../../shared/models/form";
import { ID, SortingWay } from "../../shared/models/common";
import { Workplace } from "../../shared/models/business/workplace";
import { WorkplacesFilters } from "./models";
import { SortingFieldsType } from "../../shared/models/routing";

// constants
import { DEFAULT_WORKPLACES_FILTER_FIELDS_TYPES, DEFAULT_WORKPLACES_FILTER_VALUES } from "./constants";

export class WorkplacesStore {
    @observable private _workplacesFilters: WorkplacesFilters = DEFAULT_WORKPLACES_FILTER_VALUES;
    @observable private _workplacesSorting: SortingFieldsType | null = null;
    @observable private _lastRequestedQueryKey: QueryKey = "";
    @observable private _selectedWorkplace: Workplace | null = null;
    @observable public examTemplatesLookup: Lookup<ID>[] = [];
    tableService: TableService;

    constructor() {
        this.tableService = new TableService();
        makeObservable(this);
    }

    @action.bound
    private onRouteChangeComplete() {
        this.setupWorkplacesFilterFromQueries(window.location.search);
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
    setupExamTemplatesLookup(lookup: Lookup<ID>[]) {
        this.examTemplatesLookup = lookup;
    }

    @action.bound
    setupWorkplacesFilter(name: keyof WorkplacesFilters, value: string | Array<ID> | null) {
        switch (name) {
            case "exam_template_id":
                this._workplacesFilters[name] = value as Array<ID>;
                return;
            default:
                this._workplacesFilters[name] = value as string;
                return;
        }
    }

    @action.bound
    setupLastRequestedQueryKey(queryKey: QueryKey) {
        this._lastRequestedQueryKey = queryKey;
    }

    @action.bound
    setupSelectedWorkplace(workplace: Workplace | null) {
        this._selectedWorkplace = workplace;
    }

    @action.bound
    resetWorkplacesFilters() {
        this._workplacesFilters = DEFAULT_WORKPLACES_FILTER_VALUES;
        this._workplacesSorting = null;
    }

    @action.bound
    setupWorkplacesFilterFromQueries(queryString: string) {
        const transformedFilterQueries = getTransformedQueries(queryString, DEFAULT_WORKPLACES_FILTER_FIELDS_TYPES);
        const nextFilters = { ...this.workplacesFilters, ...transformedFilterQueries };
        this._workplacesFilters = nextFilters;

        const transformedSortingQueries = { ...this._workplacesSorting, ...getTransformedSortingQueries(queryString) };
        const nextSorting = isEmpty(transformedSortingQueries)
            ? null
            : (transformedSortingQueries as SortingFieldsType);
        this._workplacesSorting = nextSorting;

        this.tableService.setupAreFiltersInitialized(true);
        return stringify({ ...nextFilters, ...nextSorting }, { skipNull: true, skipEmptyString: true });
    }

    @action.bound
    setupWorkplacesSorting(state: SortingState) {
        if (isEmpty(state)) {
            this._workplacesSorting = null;
        } else {
            this._workplacesSorting = {
                order_by: state[0].id,
                order_way: state[0].desc ? SortingWay.DESC : SortingWay.ASC,
            };
        }
    }

    @computed
    get workplacesFilters() {
        return this._workplacesFilters;
    }

    @computed
    get workplacesFiltersQueryString() {
        return stringify(
            { ...this._workplacesFilters, ...this._workplacesSorting },
            {
                arrayFormat: "bracket",
                skipEmptyString: true,
                skipNull: true,
            }
        );
    }

    @computed
    get lastRequestedQueryKey() {
        return this._lastRequestedQueryKey;
    }

    @computed
    get selectedWorkplace() {
        return this._selectedWorkplace;
    }

    @computed
    get activeWorkplaceFilters() {
        return {
            search_string: this.workplacesFilters.search_string,
            exam_template_id: this.examTemplatesLookup.filter(({ value }) =>
                this.workplacesFilters.exam_template_id.includes(value)
            ),
        };
    }
}

export const WorkplacesStoreContext = createContext({
    workplacesStore: new WorkplacesStore(),
});

interface WorkplacesStoreContextValue {
    workplacesStore: WorkplacesStore;
}

export const useWorkplacesStore = (): WorkplacesStoreContextValue => useContext(WorkplacesStoreContext);
