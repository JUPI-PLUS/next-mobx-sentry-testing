import { observer } from "mobx-react";
import React from "react";
import { useFormContext } from "react-hook-form";
import { OutlineButton, SolidButton } from "../../../../../../components/uiKit/Button/Button";
import { usePermissionsStore } from "../../../../store";

const PermissionsTableSummary = () => {
    const {
        permissionsStore: { setupCurrentPermissions },
    } = usePermissionsStore();

    const {
        reset,
        formState: { defaultValues, isSubmitting },
    } = useFormContext();

    const onResetChanges = () => {
        if (defaultValues) {
            reset(defaultValues);
            setupCurrentPermissions(defaultValues);
        }
    };

    return (
        <div className="sticky left-0 right-0 bottom-0 w-full border-t rounded-r-lg rounded-b-lg bg-white flex items-center justify-end p-6 gap-2">
            <div className="flex gap-x-3 items-center justify-end leading-none h-full">
                <OutlineButton
                    text="Cancel"
                    size="md"
                    type="button"
                    onClick={onResetChanges}
                    data-testid="cancel-permissions-update"
                />
                <SolidButton
                    data-testid="submit-permissions-update"
                    text="Save"
                    size="md"
                    type="submit"
                    disabled={isSubmitting}
                />
            </div>
        </div>
    );
};

export default observer(PermissionsTableSummary);
