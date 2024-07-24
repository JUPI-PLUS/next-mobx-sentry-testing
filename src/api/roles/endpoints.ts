import { ID } from "../../shared/models/common";

export const ROLES_ENDPOINTS = {
    root: "roles",
    list(filters: string) {
        return `${this.root}?${filters}`;
    },
    byPermission(id: ID) {
        return `${this.root}/permission/${id}`;
    },
    item(id: ID) {
        return `${this.root}/${id}`;
    },
    linkPermissions() {
        return `${this.root}/permissions`;
    },
};
