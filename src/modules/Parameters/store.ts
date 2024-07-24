// libs
import { createContext, useContext } from "react";
import { action, computed, makeObservable, observable } from "mobx";
import { stringify } from "query-string";
import { QueryKey } from "react-query/types/core/types";
import { SortingState } from "@tanstack/react-table";
import isEmpty from "lodash/isEmpty";

// services
import { TableService } from "../../shared/services/TableService";

// helpers
import { getTransformedQueries, getTransformedSortingQueries } from "../../shared/utils/routing";

// models
import { ParametersFilters } from "./models";
import { Lookup } from "../../shared/models/form";
import { ID, SortingWay } from "../../shared/models/common";
import { Parameter } from "../../shared/models/business/parameter";
import { ParameterViewTypeEnum } from "../../shared/models/business/enums";
import { SortingFieldsType } from "../../shared/models/routing";

// constants
import { DEFAULT_PARAMETERS_FILTER_FIELDS_TYPES } from "./constants";

export const DEFAULT_PARAMETERS_FILTER_VALUES = {
    code: "",
};

export enum ParameterActionsEnum {
    EDIT,
    DELETE,
}

export class ParametersStore {
    @observable private _parameterFilters: ParametersFilters = DEFAULT_PARAMETERS_FILTER_VALUES;
    @observable private _parameterSorting: SortingFieldsType | null = null;
    @observable private _lastRequestedQueryKey: QueryKey = "";
    @observable private _selectedParameter: Parameter | null = null;
    @observable private _parameterAction: ParameterActionsEnum | null = null;
    @observable public measurementUnitsLookup: Lookup<ID>[] = [];
    @observable public parameterTypesLookup: Lookup<ParameterViewTypeEnum>[] = [];
    @observable public examinationTemplateStatusesLookup: Lookup<ID>[] = [];
    tableService: TableService;

    constructor() {
        this.tableService = new TableService();
        makeObservable(this);
    }

    @action.bound
    private onRouteChangeComplete() {
        this.setupParametersFilterFromQueries(window.location.search);
    }

    @action.bound
    initialize() {
        this.tableService.subscribeToRouterEvents(this.onRouteChangeComplete);
    }

    @action.bound
    cleanup() {
        this.tableService.unsubscribeRouterEvents(this.onRouteChangeComplete);
    }

    @computed
    get parameterSorting() {
        return this._parameterSorting;
    }

    @action.bound
    setupMeasurementUnits(lookup: Lookup<ID>[]) {
        this.measurementUnitsLookup = lookup;
    }

    @action.bound
    setupParameterTypes(lookup: Lookup<ParameterViewTypeEnum>[]) {
        this.parameterTypesLookup = lookup;
    }

    @action.bound
    setupExaminationTemplateStatusesLookup(lookup: Lookup<ID>[]) {
        this.examinationTemplateStatusesLookup = lookup;
    }

    @action.bound
    setupParameterFilter(name: keyof ParametersFilters, value: string) {
        this._parameterFilters[name] = value;
    }

    @action.bound
    setupParameterSorting(state: SortingState) {
        if (isEmpty(state)) {
            this._parameterSorting = null;
        } else {
            this._parameterSorting = {
                order_by: state[0].id,
                order_way: state[0].desc ? SortingWay.DESC : SortingWay.ASC,
            };
        }
    }

    @action.bound
    setupLastRequestedQueryKey(queryKey: QueryKey) {
        this._lastRequestedQueryKey = queryKey;
    }

    @action.bound
    setupSelectedParameter(parameter: Parameter | null) {
        this._selectedParameter = parameter;
    }

    @action.bound
    setupParameterAction(act: ParameterActionsEnum | null) {
        this._parameterAction = act;
    }

    @action.bound
    resetParametersFilters() {
        this._parameterFilters = DEFAULT_PARAMETERS_FILTER_VALUES;
        this._parameterSorting = null;
    }

    @action.bound
    setupParametersFilterFromQueries(queryString: string) {
        const transformedQueries = getTransformedQueries(queryString, DEFAULT_PARAMETERS_FILTER_FIELDS_TYPES);
        const nextFilters = { ...this._parameterFilters, ...transformedQueries };
        this._parameterFilters = nextFilters;

        const transformedSortingQueries = { ...this._parameterSorting, ...getTransformedSortingQueries(queryString) };
        const nextSorting = isEmpty(transformedSortingQueries)
            ? null
            : (transformedSortingQueries as SortingFieldsType);
        this._parameterSorting = nextSorting;

        this.tableService.setupAreFiltersInitialized(true);
        return stringify({ ...nextFilters, ...nextSorting }, { skipNull: true, skipEmptyString: true });
    }

    @computed
    get parameterFilters() {
        return this._parameterFilters;
    }

    @computed
    get parameterFiltersQueryString() {
        return stringify(
            { ...this._parameterFilters, ...this._parameterSorting },
            { skipEmptyString: true, skipNull: true }
        );
    }

    @computed
    get lastRequestedQueryKey() {
        return this._lastRequestedQueryKey;
    }

    @computed
    get selectedParameter() {
        return this._selectedParameter;
    }

    @computed
    get parameterAction() {
        return this._parameterAction;
    }

    @computed
    get isEditParameterDrawerOpen() {
        return Boolean(this._selectedParameter) && this._parameterAction === ParameterActionsEnum.EDIT;
    }

    @computed
    get isDeleteParameterDrawerOpen() {
        return Boolean(this._selectedParameter) && this._parameterAction === ParameterActionsEnum.DELETE;
    }
}

export const ParametersStoreContext = createContext({
    parametersStore: new ParametersStore(),
});

interface ParametersStoreContextValue {
    parametersStore: ParametersStore;
}

export const useParametersStore = (): ParametersStoreContextValue => useContext(ParametersStoreContext);
