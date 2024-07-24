import { Permission } from "../../shared/models/permissions";
import { PermissionsFormValues } from "./models";

export const getIdsFromObjectKeys = (values: PermissionsFormValues) => {
    return Object.keys(values)
        .reduce((acc: Array<number>, value: string) => {
            if (values[value]) {
                return [...acc, Number(value)];
            }
            return acc;
        }, [])
        .map(stringId => Number(stringId));
};

export const getPermissionsObjectFromArray = (values: Array<Permission>, isChecked: boolean) => {
    return values.reduce((acc, { id }) => ({ ...acc, [id]: isChecked }), {});
};

export const getOverwritedDefaultPermissions = (
    defaultPermissions: Record<string, boolean>,
    newPermissions: Array<Permission>,
    isChecked: boolean
) => ({
    ...defaultPermissions,
    ...getPermissionsObjectFromArray(newPermissions, isChecked),
});
