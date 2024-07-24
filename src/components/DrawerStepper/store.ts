import { action, computed, makeObservable, observable } from "mobx";
import { createContext, useContext } from "react";
import { DrawerSize } from "../uiKit/Drawer/models";

export class DrawerStepperStore {
    @observable private _step = 0;
    @observable private _isSubmitButtonDisabled = false;
    @observable private _submitText = "";
    @observable private _isChangingStep = false;
    @observable private _isSubmitted = false;
    @observable private _size: DrawerSize = "lg";

    constructor() {
        makeObservable(this);
    }

    @action.bound
    goToNextStep() {
        this._step += 1;
        this.setupIsChangingStep(true);
    }

    @action.bound
    goToPrevStep() {
        this._step -= 1;
        this.setupIsChangingStep(true);
    }

    @action.bound
    disableSubmitButton(flag: boolean) {
        this._isSubmitButtonDisabled = flag;
    }

    @action.bound
    enableSubmitButton() {
        this._isSubmitButtonDisabled = false;
    }

    @action.bound
    setupSubmitButtonText(text: string) {
        this._submitText = text;
    }

    @action.bound
    setupIsChangingStep(toggle: boolean) {
        this._isChangingStep = toggle;
    }

    @action.bound
    setupIsSubmitted() {
        this._isSubmitted = true;
    }

    @action.bound
    setupDrawerSize(size: DrawerSize) {
        this._size = size;
    }

    @action.bound
    cleanup() {
        this._step = 0;
        this._isSubmitButtonDisabled = false;
        this._isSubmitted = false;
        this._submitText = "";
        this._size = "lg";
    }

    @computed
    get activeStep() {
        return this._step;
    }

    @computed
    get isSubmitButtonDisabled() {
        return this._isSubmitButtonDisabled;
    }

    @computed
    get submitButtonText() {
        return this._submitText;
    }

    @computed
    get isStepChanging() {
        return this._isChangingStep;
    }

    @computed
    get isSubmitted() {
        return this._isSubmitted;
    }

    @computed
    get size() {
        return this._size;
    }
}

export const DrawerStepperStoreContext = createContext({
    drawerStepperStore: new DrawerStepperStore(),
});

interface DrawerStepperStoreContextValue {
    drawerStepperStore: DrawerStepperStore;
}

export const useDrawerStepperStore = (): DrawerStepperStoreContextValue => useContext(DrawerStepperStoreContext);
