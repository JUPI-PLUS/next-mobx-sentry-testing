import { limsClient, limsImageHostClient } from "../config";
import { USERS_ENDPOINTS } from "./endpoints";
import { LoginFormFields, LoginResponse } from "../../modules/Login/components/LoginForm/models";
import { FilteredUser, Me, Patient } from "../../shared/models/business/user";
import { PromisedServerResponse } from "../../shared/models/axios";
import { AxiosResponse } from "axios";
import { UserRoleDictionaryItem } from "../../shared/models/dictionaries";
import { PatchUserRolesRequest } from "../../modules/PatientProfile/components/Roles/models";

export const me = (): PromisedServerResponse<Me> => limsClient.post(USERS_ENDPOINTS.me());

export const details = (id: string) => (): PromisedServerResponse<Patient> =>
    limsClient.get(USERS_ENDPOINTS.details(id));

// TODO: fix types Promise<AxiosResponse>
export const login = (loginFormFields: LoginFormFields): Promise<AxiosResponse<LoginResponse>> =>
    limsClient.post(USERS_ENDPOINTS.login(), loginFormFields, {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_APPLICATION_TOKEN || ""}`,
        },
    });

export const logout = (): PromisedServerResponse<Response> => limsClient.post(USERS_ENDPOINTS.logout());

export const refreshToken = (): Promise<AxiosResponse<{ access_token: string }>> =>
    limsClient.post(USERS_ENDPOINTS.refresh(), {});

export const listOfUsers = (filters: string) => (): PromisedServerResponse<FilteredUser, "list"> =>
    limsClient.get(USERS_ENDPOINTS.list(filters));

export const userAvatar = (uuid: string, imageName: string) => (): Promise<{ data: string }> =>
    limsImageHostClient.get(USERS_ENDPOINTS.avatar(uuid, imageName));

export const getUserRoles = (uuid: string) => (): PromisedServerResponse<UserRoleDictionaryItem[]> =>
    limsClient.get(USERS_ENDPOINTS.userRoles(uuid));

export const patchUserRoles = (body: PatchUserRolesRequest): PromisedServerResponse<UserRoleDictionaryItem[]> =>
    limsClient.patch(USERS_ENDPOINTS.roles(), body);
