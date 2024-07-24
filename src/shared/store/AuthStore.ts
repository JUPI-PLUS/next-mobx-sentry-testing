import { action, autorun, computed, makeObservable, observable } from "mobx";
import { removeAuthToken, setAuthToken, setPermissionsFromDecodedAuthToken } from "../utils/auth";
import UserStore from "./UserStore";
import Router from "next/router";
import { ROUTES } from "../constants/routes";
import { AUTH_LOCAL_STORAGE_KEYS } from "../constants/auth";
import { clearQueriesLogout } from "../utils/clearQueriesLogout";
import { logout as logoutRequest } from "../../api/users";

export class AuthStore {
    @observable public isLoggedIn: boolean | null = null;
    @observable private _memorizedRoute: string | null = null;
    @observable private _isFormOnThePage = false;

    constructor() {
        makeObservable(this);
        autorun(() => {
            if (!window) return;
            window.addEventListener("storage", this.updateLocalStorageToken, false);
        });
    }

    @action.bound
    private updateLocalStorageToken(event: StorageEvent) {
        const { newValue, oldValue, key } = event;
        if (key !== AUTH_LOCAL_STORAGE_KEYS.ACCESS_TOKEN) return;
        if (Boolean(oldValue) && (newValue === "" || newValue === null)) {
            this.isLoggedIn = false;
            removeAuthToken();
            clearQueriesLogout();
            UserStore.cleanup();
            Router.replace(ROUTES.login.route);
            return;
        }

        if (!oldValue && newValue) {
            this.isLoggedIn = true;
            setAuthToken(newValue);
            Router.replace(ROUTES.dashboard.route);
        }
    }

    @action.bound
    setAccessToken(token: string | null) {
        this.isLoggedIn = Boolean(token);

        if (token) {
            setPermissionsFromDecodedAuthToken(token);
        }
        setAuthToken(token || "");
    }

    @action.bound
    setMemorizedRoute(route: string | null) {
        this._memorizedRoute = route;
    }

    @action.bound
    login() {
        this.isLoggedIn = true;
    }

    @action.bound
    private _proceedLogoutRedirect(isFailedRefresh = false) {
        Router.replace(ROUTES.login.route).then(() => {
            UserStore.cleanup();
            if (!isFailedRefresh) {
                this._memorizedRoute = null;
            }
            this.isLoggedIn = false;
            clearQueriesLogout();
        });
    }

    @action.bound
    public proceedLogoutAndCleanStorage() {
        return logoutRequest().then(removeAuthToken);
    }

    @action.bound
    async logout(isFailedRefresh = false) {
        if (this._isFormOnThePage) {
            this._proceedLogoutRedirect(isFailedRefresh);
        } else {
            this.proceedLogoutAndCleanStorage().then(() => this._proceedLogoutRedirect(isFailedRefresh));
        }
    }

    @action.bound
    setupIsFormOnThePage(isExist: boolean) {
        this._isFormOnThePage = isExist;
    }

    @computed
    get memorizedRoute() {
        return this._memorizedRoute;
    }
}

export default new AuthStore();
