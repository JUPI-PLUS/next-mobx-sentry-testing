import { ID } from "../../shared/models/common";

export type RolesFilters = {
    name: string;
};

export type LinkPermissionsToRoleParameters = { role: ID; permissions: Array<number> };
export type PermissionsFormValues = Record<string, boolean>;
export type AddRoleData = { name: string };
export type UpdateRoleData = { name: string };
