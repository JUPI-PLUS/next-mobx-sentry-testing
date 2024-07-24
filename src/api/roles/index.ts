import { Role } from "./../../shared/models/roles";
import { limsClient } from "../config";
import { PromisedServerResponse } from "../../shared/models/axios";
import { ROLES_ENDPOINTS } from "./endpoints";
import { ID } from "../../shared/models/common";
import { AddRoleData, LinkPermissionsToRoleParameters, UpdateRoleData } from "../../modules/PermissionsModule/models";
import { DeleteRoleData } from "../../modules/PermissionsModule/components/dialogs/DeleteRoleDialog/models";

export const getRolesList = (filters: string) => (): PromisedServerResponse<Array<Role>> =>
    limsClient.get(ROLES_ENDPOINTS.list(filters));

export const getRolesListByPermission = (id: ID) => (): PromisedServerResponse<Array<Role>> =>
    limsClient.get(ROLES_ENDPOINTS.byPermission(id));

export const createRole = (newRoleData: AddRoleData): PromisedServerResponse<Role> =>
    limsClient.post(ROLES_ENDPOINTS.root, newRoleData);

export const deleteRole = ({ id }: DeleteRoleData): PromisedServerResponse<void> =>
    limsClient.delete(ROLES_ENDPOINTS.item(id));

export const updateRole =
    (id: ID) =>
    (updateRoleData: UpdateRoleData): PromisedServerResponse<Role> =>
        limsClient.patch(ROLES_ENDPOINTS.item(id), updateRoleData);

export const addRolePermissions = (body: LinkPermissionsToRoleParameters) =>
    limsClient.patch(ROLES_ENDPOINTS.linkPermissions(), body);
