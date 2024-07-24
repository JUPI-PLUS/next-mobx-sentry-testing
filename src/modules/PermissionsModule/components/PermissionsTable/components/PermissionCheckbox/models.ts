import { Permission } from "../../../../../../shared/models/permissions";

export type PermissionCheckboxProps = {
    permissions: Array<Permission>;
    title: string;
    onChange: (checked: boolean) => void;
    isLoading: boolean;
};
