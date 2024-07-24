// libs
import { createContext, useContext } from "react";
import { action, computed, makeObservable, observable } from "mobx";
import { stringify } from "query-string";
import { QueryKey } from "react-query/types/core/types";

// services
import { TableService } from "../../shared/services/TableService";

// helpers
import { getTransformedQueries } from "../../shared/utils/routing";

// models
import { ParameterOption } from "./components/ParameterOptionsTable/models";
import { OptionAction, ParameterOptionsFilters } from "./models";

// constants
import {
    DEFAULT_PARAMETER_OPTIONS_FILTER_FIELDS_TYPES,
    DEFAULT_PARAMETER_OPTIONS_FILTER_VALUES,
} from "./constants/filters";

export class ParameterOptionsStore {
    @observable private _parameterOptionsFilters: ParameterOptionsFilters = DEFAULT_PARAMETER_OPTIONS_FILTER_VALUES;
    @observable private _lastRequestedQueryKey: QueryKey = [];
    @observable private _option: ParameterOption | null = null;
    @observable private _optionAction: OptionAction | null = null;
    tableService: TableService;

    constructor() {
        this.tableService = new TableService();
        makeObservable(this);
    }

    @action.bound
    private onRouteChangeComplete() {
        this.setupParameterOptionsFilterFromQueries(window.location.search);
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
    setupParameterOptionsFilter(name: keyof ParameterOptionsFilters, value: string) {
        this._parameterOptionsFilters[name] = value as string;
    }

    @action.bound
    setupOption(option: ParameterOption) {
        this._option = option;
    }

    @action.bound
    setupOptionAction(optionAction: OptionAction) {
        this._optionAction = optionAction;
    }

    @action.bound
    setupLastRequestedQueryKey(queryKey: QueryKey) {
        this._lastRequestedQueryKey = queryKey;
    }

    @action.bound
    resetParameterOptionsFilters() {
        this._parameterOptionsFilters = DEFAULT_PARAMETER_OPTIONS_FILTER_VALUES;
    }

    @action.bound
    cleanupSelectedOption() {
        this._option = null;
        this._optionAction = null;
    }

    @action.bound
    setupParameterOptionsFilterFromQueries(queryString: string) {
        const transformedQueries = getTransformedQueries(queryString, DEFAULT_PARAMETER_OPTIONS_FILTER_FIELDS_TYPES);
        const nextOrderFilters = { ...this._parameterOptionsFilters, ...transformedQueries };
        this._parameterOptionsFilters = nextOrderFilters;
        this.tableService.setupAreFiltersInitialized(true);
        return stringify(nextOrderFilters, { skipNull: true, skipEmptyString: true });
    }

    @computed
    get parameterOptionsFilters() {
        return this._parameterOptionsFilters;
    }

    @computed
    get parameterOptionsFiltersQueryString() {
        return stringify(this._parameterOptionsFilters, { skipEmptyString: true, skipNull: true });
    }

    @computed
    get lastRequestedQueryKey() {
        return this._lastRequestedQueryKey;
    }

    @computed
    get option() {
        return this._option;
    }

    @computed
    get optionAction() {
        return this._optionAction;
    }

    @computed
    get isDeleteOptionDialogOpen() {
        return this.optionAction === OptionAction.DELETE && Boolean(this._option);
    }

    @computed
    get isEditOptionDialogOpen() {
        return this._optionAction === OptionAction.EDIT && Boolean(this._option);
    }
}

export const ParameterOptionsStoreContext = createContext({
    parameterOptionsStore: new ParameterOptionsStore(),
});

interface ParameterOptionsStoreContextValue {
    parameterOptionsStore: ParameterOptionsStore;
}

export const useParameterOptionsStore = (): ParameterOptionsStoreContextValue =>
    useContext(ParameterOptionsStoreContext);
