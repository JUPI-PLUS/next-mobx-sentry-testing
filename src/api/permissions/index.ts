import { limsClient } from "../config";
import { PromisedServerResponse } from "../../shared/models/axios";
import { PERMISSIONS_ENDPOINTS } from "./endpoints";
import { Permission } from "../../shared/models/permissions";
import { ID } from "../../shared/models/common";

export const getPermissionsList = (): PromisedServerResponse<Array<Permission>> =>
    limsClient.get(PERMISSIONS_ENDPOINTS.root);

export const getPermissionsByRole = (id: ID) => (): PromisedServerResponse<Array<Permission>> =>
    limsClient.get(PERMISSIONS_ENDPOINTS.byRole(id));
