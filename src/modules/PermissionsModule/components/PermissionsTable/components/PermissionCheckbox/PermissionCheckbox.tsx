import { observer } from "mobx-react";
import { useFormContext } from "react-hook-form";
import IndeterminateCheckbox from "../../../../../../components/uiKit/forms/Checkbox/IndeterminateCheckbox";
import { IndeterminateCheckboxValues } from "../../../../../../components/uiKit/forms/Checkbox/models";
import { usePermissionsStore } from "../../../../store";
import { getOverwritedDefaultPermissions } from "../../../../utils";
import { PermissionCheckboxProps } from "./models";
import FolderIcon from "../../../../../../components/uiKit/Icons/FolderIcon";

const PermissionCheckbox = ({ permissions, title, onChange, isLoading }: PermissionCheckboxProps) => {
    const {
        permissionsStore: { getGroupPermissionsCheckbox, setupGroupCurrentPermissions, currentPermissions },
    } = usePermissionsStore();
    const { setValue } = useFormContext();

    const indeterminateCheckboxValue = getGroupPermissionsCheckbox(permissions);

    const updateAllGroupCheckboxes = (isChecked: boolean) => {
        const overwritedDefaultPermissions = getOverwritedDefaultPermissions(
            currentPermissions!,
            permissions,
            isChecked
        );
        setupGroupCurrentPermissions(overwritedDefaultPermissions);

        permissions.map(permission => {
            setValue(String(permission.id), isChecked, { shouldDirty: true });
        });
    };

    const onSelectAllChange = () => {
        onChange(indeterminateCheckboxValue === IndeterminateCheckboxValues.Empty);
        updateAllGroupCheckboxes(indeterminateCheckboxValue === IndeterminateCheckboxValues.Empty);
    };

    return (
        <>
            <IndeterminateCheckbox
                value={indeterminateCheckboxValue}
                onChange={onSelectAllChange}
                className="mr-3"
                data-testid={`accordion-checkbox-${title}`}
                disabled={isLoading}
            />
            <span className="w-6 h-6">
                <FolderIcon className="fill-dark-700" />
            </span>
        </>
    );
};

export default observer(PermissionCheckbox);
