import { Lookup } from "../../../../shared/models/form";
import { CommonServerValidationProps } from "../../../../shared/models/serverValidation";
import { ID } from "../../../../shared/models/common";

export interface RolesFormFields {
    roles: Lookup<ID>[] | null;
}

export type RolesFormProps = {
    id: string;
};

export type PatchUserRolesRequest = {
    user_uuid: string;
    roles: number[];
};

export type RolesFormWithValidationProps = CommonServerValidationProps & RolesFormProps;
