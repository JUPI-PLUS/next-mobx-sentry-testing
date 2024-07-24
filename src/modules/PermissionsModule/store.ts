import { action, computed, makeObservable, observable } from "mobx";
import { computedFn } from "mobx-utils";
import { stringify } from "query-string";
import { createContext, useContext } from "react";
import { IndeterminateCheckboxValues } from "../../components/uiKit/forms/Checkbox/models";
import { Permission } from "../../shared/models/permissions";
import { Role } from "../../shared/models/roles";
import { PermissionsFormValues, RolesFilters } from "./models";

export const ROLES_FILTERS_DEFAULT_VALUES = {
    name: "",
};

export type PermissionsGroups = [string, Permission[]];

export class PermissionsStore {
    @observable public activeRole: Role | null = null;
    @observable private _listOfPermissionsId: Record<string, boolean> = {};
    @observable private _rolesFilters: RolesFilters = ROLES_FILTERS_DEFAULT_VALUES;
    @observable private _groupedPermissions: Array<PermissionsGroups> = [];
    @observable private _currentPermissions: PermissionsFormValues | null = null;
    @observable private _isDirty = false;

    constructor() {
        makeObservable(this);
    }

    @computed
    get rolesFilters() {
        return stringify(this._rolesFilters, { skipEmptyString: true, skipNull: true });
    }

    @computed
    get groupedPermissions() {
        return this._groupedPermissions;
    }

    @computed
    get currentPermissions() {
        return this._currentPermissions;
    }

    @action.bound
    setActiveRole(activeRole: Role, canBeUnsetIfSimilar = true) {
        if (activeRole && activeRole.id === this.activeRole?.id) {
            if (canBeUnsetIfSimilar) {
                this.activeRole = null;
                return;
            }
        }
        return (this.activeRole = activeRole);
    }

    @action.bound
    resetActiveRole() {
        this.activeRole = null;
    }

    @action.bound
    setupRolesFilter(name: keyof RolesFilters, value: string) {
        this._rolesFilters[name] = value;
    }

    @action.bound
    resetRolesFilter() {
        this._rolesFilters = ROLES_FILTERS_DEFAULT_VALUES;
    }

    @action.bound
    setupGroupedPermissions(groupedPermissions: Array<PermissionsGroups>) {
        this._groupedPermissions = groupedPermissions;
    }

    @action.bound
    setupCurrentPermissions(formValues: PermissionsFormValues) {
        this._currentPermissions = formValues;
    }

    @action.bound
    setupGroupCurrentPermissions(formValues: PermissionsFormValues) {
        this._isDirty = true;
        this._currentPermissions = formValues;
    }

    @action.bound
    setupRecordOfPermissionsId(list: Record<string, boolean>) {
        this._listOfPermissionsId = list;
    }

    @action.bound
    setupPermissionValue(id: number, isSelected: boolean) {
        if (!this._currentPermissions) return;
        this._isDirty = true;
        this._currentPermissions[id] = isSelected;
    }

    @action.bound
    resetIsPermissionDirty() {
        this._isDirty = false;
    }

    @action.bound
    cleanup() {
        this.activeRole = null;
        this._listOfPermissionsId = {};
        this._groupedPermissions = [];
        this._currentPermissions = null;
        this._isDirty = false;
    }

    @computed get recordOfPermissionsId() {
        return this._listOfPermissionsId;
    }

    @computed get isPermissionsDirty() {
        return this._isDirty;
    }

    getGroupPermissionsCheckbox = computedFn((permissions: Array<Permission>) => {
        const permissionIds = permissions.map(permission => permission.id);

        const isSomeCheckboxTrue = permissionIds.some(id => this._currentPermissions && this._currentPermissions[id]);

        const isEveryCheckboxTrue = permissionIds.every(id => {
            if (this._currentPermissions) {
                return this._currentPermissions[id];
            }
            return false;
        });

        if (!isSomeCheckboxTrue) {
            return IndeterminateCheckboxValues.Empty;
        }

        if (isEveryCheckboxTrue) {
            return IndeterminateCheckboxValues.Checked;
        }
        return IndeterminateCheckboxValues.Indeterminate;
    });
}

export const PermissionsStoreContext = createContext({
    permissionsStore: new PermissionsStore(),
});

interface PermissionsStoreContextValue {
    permissionsStore: PermissionsStore;
}

export const usePermissionsStore = (): PermissionsStoreContextValue => useContext(PermissionsStoreContext);
