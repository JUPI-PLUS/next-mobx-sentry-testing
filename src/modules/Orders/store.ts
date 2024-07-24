// libs
import { createContext, useContext } from "react";
import { action, computed, makeObservable, observable } from "mobx";
import { stringify } from "query-string";
import { QueryKey } from "react-query/types/core/types";
import isEqual from "lodash/isEqual";

// services
import { TableService } from "../../shared/services/TableService";

// helpers
import { getCalendarDefaultValue } from "../../components/uiKit/DatePickers/utils";
import { getTransformedQueries } from "../../shared/utils/routing";

// models
import { OrdersFilters, UserFilters } from "./models";
import { Lookup } from "../../shared/models/form";
import { ID } from "../../shared/models/common";
import { FilteredUser } from "../../shared/models/business/user";

// constants
import {
    DEFAULT_ORDERS_FILTER_FIELDS_TYPES,
    DEFAULT_ORDERS_FILTER_VALUES,
    DEFAULT_USER_FILTER_VALUES,
} from "./constants";

export class OrdersStore {
    @observable public activeUser: FilteredUser | null = null;
    @observable public orderStatusesLookup: Lookup<ID>[] = [];
    @observable private _userFilters: UserFilters = DEFAULT_USER_FILTER_VALUES;
    @observable private _orderFilters: OrdersFilters = DEFAULT_ORDERS_FILTER_VALUES;
    @observable public lastRequestedOrdersQueryKey: QueryKey | undefined = undefined;
    tableService: TableService;

    constructor() {
        this.tableService = new TableService();
        makeObservable(this);
    }

    @action.bound
    private onRouteChangeComplete() {
        this.setupOrderFilterFromQueries(window.location.search);
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
    setupOrderStatusesLookup(lookup: Lookup<ID>[]) {
        this.orderStatusesLookup = lookup;
    }

    @action.bound
    setupUserFilterValue(name: keyof UserFilters, value: string | number | null) {
        if (name === "birth_date_to" || name === "birth_date_from") {
            this._userFilters[name] = value as number | null;
            return;
        }

        this._userFilters[name] = value as string;
    }

    @action.bound
    resetUserFilter() {
        this._userFilters = DEFAULT_USER_FILTER_VALUES;
    }

    @action.bound
    setupActiveUser(user: FilteredUser | null) {
        if (user) {
            this.activeUser = user;
            this._orderFilters.user_uuid = user.uuid;
            return;
        }

        this.activeUser = null;
        this._orderFilters.user_uuid = "";
    }

    @action.bound
    setupOrderFilter(name: keyof OrdersFilters, value: string | number | null) {
        switch (name) {
            case "created_at_from":
            case "created_at_to":
            case "status":
                this._orderFilters[name] = value as number | null;
                break;
            default:
                this._orderFilters[name] = value as string;
        }
    }

    @action.bound
    setupOrderFilterFromQueries(queryString: string) {
        const transformedQueries = getTransformedQueries(queryString, DEFAULT_ORDERS_FILTER_FIELDS_TYPES);
        const nextOrderFilters = { ...this._orderFilters, ...transformedQueries };
        this._orderFilters = nextOrderFilters;
        this.tableService.setupAreFiltersInitialized(true);
        return stringify(nextOrderFilters, { skipNull: true, skipEmptyString: true });
    }

    @action.bound
    resetOrdersFilter() {
        this._orderFilters = DEFAULT_ORDERS_FILTER_VALUES;
    }

    @computed
    get usersFiltersQueryString() {
        return stringify(this._userFilters, { skipEmptyString: true, skipNull: true });
    }

    @computed
    get isUserHiddenFiltersFilled() {
        const { barcode: filledBarcode, ...restFilledFilterValues } = this._userFilters;
        const { barcode: defaultBarcode, ...restDefaultFilterValues } = DEFAULT_USER_FILTER_VALUES;
        return !isEqual(restFilledFilterValues, restDefaultFilterValues);
    }

    @computed
    get isUserUUIDFilterFilled() {
        return Boolean(this._userFilters.barcode);
    }

    @computed
    get activeUsersFilter() {
        return {
            email: this._userFilters.email,
            first_name: this._userFilters.first_name,
            last_name: this._userFilters.last_name,
            barcode: this._userFilters.barcode,
            birthday: { from: this._userFilters.birth_date_from },
        };
    }

    @computed
    get ordersFiltersQueryString() {
        return stringify(this._orderFilters, { skipEmptyString: true, skipNull: true });
    }

    @computed
    get activeOrdersFilter() {
        return {
            order_number: this._orderFilters.order_number,
            status: this._orderFilters.status,
            user_uuid: this._orderFilters.user_uuid,
            created_at: getCalendarDefaultValue({
                from: this._orderFilters.created_at_from,
                to: this._orderFilters.created_at_to,
            }),
        };
    }
}

export const OrdersStoreContext = createContext({
    ordersStore: new OrdersStore(),
});

interface OrdersStoreContextValue {
    ordersStore: OrdersStore;
}

export const useOrdersStore = (): OrdersStoreContextValue => useContext(OrdersStoreContext);
