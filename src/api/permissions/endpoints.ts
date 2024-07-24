import { ID } from "../../shared/models/common";

export const PERMISSIONS_ENDPOINTS = {
    root: "permissions",
    byRole(id: ID) {
        return `${this.root}/role/${id}`;
    },
};
