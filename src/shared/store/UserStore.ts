import { action, computed, makeObservable, observable } from "mobx";
import { Me, UserStatus } from "../models/business/user";
import { CurrentAccess } from "../models/permissions";

export class UserStore {
    @observable public user: Me | null = null;
    @observable private _permissions: CurrentAccess = [];

    constructor() {
        makeObservable(this);
    }

    @action.bound
    cleanup() {
        this.user = null;
        this._permissions = [];
    }

    @action.bound
    setUser(user: Me) {
        this.user = user;
    }

    @action.bound
    setupPermissions(permissions: number[]) {
        this._permissions = permissions;
    }

    @computed get email() {
        return this.user?.email || "";
    }

    @computed get name() {
        const firstName = this.user?.first_name ?? "";
        const lastName = this.user?.last_name ?? "";
        return `${firstName} ${lastName}`;
    }

    @computed get avatar() {
        return this.user?.profile_photo ?? "";
    }

    @computed get status() {
        return this.user?.status ?? UserStatus.NEW;
    }

    @computed get uuid() {
        return this.user!.uuid;
    }

    @computed get permissions() {
        return this._permissions;
    }
}

export default new UserStore();
