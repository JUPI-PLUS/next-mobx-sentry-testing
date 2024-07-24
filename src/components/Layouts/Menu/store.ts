import { action, autorun, makeObservable, observable } from "mobx";
import { IS_MENU_OPEN_LOCAL_STORAGE_KEY } from "../../../shared/constants/common";

class MenuStore {
    @observable public isOpen = false;
    constructor() {
        makeObservable(this);
        autorun(() => {
            this.isOpen = Boolean(window.localStorage.getItem(IS_MENU_OPEN_LOCAL_STORAGE_KEY));
        });
    }

    @action.bound
    toggle() {
        if (this.isOpen) {
            window.localStorage.removeItem(IS_MENU_OPEN_LOCAL_STORAGE_KEY);
        } else {
            window.localStorage.setItem(IS_MENU_OPEN_LOCAL_STORAGE_KEY, "true");
        }
        this.isOpen = !this.isOpen;
    }
}

export default new MenuStore();
