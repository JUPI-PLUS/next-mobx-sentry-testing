// libs
import { action, computed, makeObservable, observable } from "mobx";
import { createContext, useContext } from "react";

// models
import { Patient } from "../../shared/models/business/user";
import { hiddenConditionsArray, OrderConditionResponse } from "./models";

export class KitActivationStore {
    @observable public kitCode = "";
    @observable public conditions: Array<OrderConditionResponse> = [];
    @observable private _orderPatient: Patient | null = null;

    constructor() {
        makeObservable(this);
    }

    @action.bound
    setupKitCode(kitCode: string) {
        this.kitCode = kitCode;
    }

    @action.bound
    setupOrderPatient(patient: Patient) {
        this._orderPatient = patient;
    }

    @action.bound
    resetOrderPatient() {
        this._orderPatient = null;
    }

    @action.bound
    setupConditions(conditions: Array<OrderConditionResponse>) {
        this.conditions = conditions;
    }

    @action.bound
    resetConditions() {
        this.conditions = [];
    }

    @action.bound
    cleanup() {
        this.setupKitCode("");
        this.resetConditions();
        this.resetOrderPatient();
    }

    @computed
    get orderPatient() {
        return this._orderPatient;
    }

    @computed
    get filteredConditions() {
        return this.conditions.filter(cond => !hiddenConditionsArray.includes(cond.id));
    }
}

export const KitActivationStoreContext = createContext({
    kitActivationStore: new KitActivationStore(),
});

interface KitActivationStoreContextValue {
    kitActivationStore: KitActivationStore;
}

export const useKitActivationStore = (): KitActivationStoreContextValue => useContext(KitActivationStoreContext);
