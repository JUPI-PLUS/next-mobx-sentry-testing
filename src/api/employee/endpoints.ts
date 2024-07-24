import { ID } from "../../shared/models/common";

export const EMPLOYEE_ENDPOINTS = {
    root: "profile",
    editUserProfile(id: ID) {
        return `${this.root}/${id}`;
    },
};
