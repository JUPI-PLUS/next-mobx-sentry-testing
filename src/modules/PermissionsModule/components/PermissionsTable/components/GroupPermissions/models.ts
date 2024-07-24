import { Permission } from "../../../../../../shared/models/permissions";

export interface GroupPermissionsProps {
    title: string;
    permissions: Permission[];
    isLoading: boolean;
}
