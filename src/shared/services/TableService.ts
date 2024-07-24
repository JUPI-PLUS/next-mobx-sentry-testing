// libs
import { action, computed, makeObservable, observable } from "mobx";
import Router from "next/router";

export class TableService {
    @observable private _areFiltersInitialized = false;

    constructor() {
        makeObservable(this);
    }

    subscribeToRouterEvents = (callback: () => void) => {
        Router.events.on("routeChangeComplete", callback);
    };

    @action.bound
    unsubscribeRouterEvents(callback: () => void) {
        Router.events.off("routeChangeComplete", callback);
        this.setupAreFiltersInitialized(false);
    }

    @action.bound
    setupAreFiltersInitialized(value: boolean) {
        this._areFiltersInitialized = value;
    }

    @computed
    get areFiltersInitialized() {
        return this._areFiltersInitialized;
    }
}
