// libs
import { createContext, useContext } from "react";
import { action, computed, makeObservable, observable } from "mobx";
import { RowSelectionState } from "@tanstack/table-core";
import { SortingState } from "@tanstack/react-table";

// helpers
import { getActivePageIndex } from "./utils";
import { getTransformedSortingQueries, isQueryNumberNatural } from "../../shared/utils/routing";

// models
import { SortingWay } from "../../shared/models/common";

// constants
import { DEFAULT_PAGE_INDEX, DEFAULT_PAGE_SIZE, DEFAULT_TOTAL_PAGES } from "./constants";

export class TableStore {
    @observable private _totalPages = DEFAULT_TOTAL_PAGES;
    @observable private _activeFilters = "";
    @observable private _rowSelection = {};
    @observable public pageIndex = DEFAULT_PAGE_INDEX;
    @observable public pageSize = DEFAULT_PAGE_SIZE;
    @observable public sorting: SortingState = [];

    constructor() {
        makeObservable(this);
    }

    @action.bound
    setupTotalPages(count: number) {
        this._totalPages = count;
    }

    @action.bound
    setupActiveFilters(filters: string) {
        this._activeFilters = filters;
        const { order_by: orderBy, order_way: orderWay } = getTransformedSortingQueries(filters) || {};
        if (orderBy) {
            this.setupSorting([{ id: orderBy, desc: orderWay === SortingWay.DESC }]);
        }
    }

    @action.bound
    setupPageIndex(index: number) {
        this.pageIndex = index;
    }

    @action.bound
    setupPageSize(size: number) {
        this.pageSize = size;
    }

    @action.bound
    setupSorting(sortingState: SortingState) {
        this.sorting = sortingState;
    }

    @action.bound
    setupRowSelection(cb: RowSelectionState) {
        this._rowSelection = cb;
    }

    @action.bound
    setupPageByQueryParameter(queryPage: string | string[] | undefined) {
        if (!isQueryNumberNatural(queryPage)) return;
        const numericQueryPage = Number(queryPage);
        // - 1 cause u need page index
        if (this.pageIndex !== numericQueryPage - 1) {
            this.pageIndex = numericQueryPage - 1;
        }
    }

    @action.bound
    cleanup() {
        this.pageIndex = DEFAULT_PAGE_INDEX;
        this._totalPages = DEFAULT_TOTAL_PAGES;
        this.pageSize = DEFAULT_PAGE_SIZE;
        this.sorting = [];
        this._activeFilters = "";
        this._rowSelection = {};
    }

    @computed get totalPages() {
        return this._totalPages;
    }

    @computed get activeFilters() {
        return this._activeFilters;
    }

    @computed get rowSelection() {
        return this._rowSelection;
    }

    getActivePageIndexWithFilters = (filters: string) => {
        return getActivePageIndex(this._activeFilters, filters, this.pageIndex, this._totalPages);
    };
}

export const TableStoreContext = createContext({
    tableStore: new TableStore(),
});

interface TableStoreContextValue {
    tableStore: TableStore;
}

export const useTableStore = (): TableStoreContextValue => useContext(TableStoreContext);
