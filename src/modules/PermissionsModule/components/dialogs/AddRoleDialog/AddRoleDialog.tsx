import { PlusIcon } from "@heroicons/react/20/solid";
import { AxiosError } from "axios";
import { observer } from "mobx-react";
import { useMutation } from "react-query";
import { queryClient } from "../../../../../../pages/_app";
import { createRole } from "../../../../../api/roles";
import { TextButton } from "../../../../../components/uiKit/Button/Button";
import FormDialog from "../../../../../components/uiKit/Dialog/FormDialog";
import { showSuccessToast } from "../../../../../components/uiKit/Toast/helpers";
import { ROLES_QUERY_KEYS } from "../../../../../shared/constants/queryKeys";
import { useDisclosure } from "../../../../../shared/hooks/useDisclosure";
import { BaseFormServerValidation, ServerResponse } from "../../../../../shared/models/axios";
import { Role } from "../../../../../shared/models/roles";
import { AddRoleData } from "../../../models";
import { usePermissionsStore } from "../../../store";
import AddRoleFormContent from "./AddRoleFormContent/AddRoleFormContent";
import { DEFAULT_VALUES, schema } from "./schema";

const AddRoleDialog = () => {
    const {
        permissionsStore: { rolesFilters },
    } = usePermissionsStore();

    const { isOpen, onClose, onOpen } = useDisclosure();

    const { mutateAsync, error, reset } = useMutation<
        ServerResponse<Role>,
        AxiosError<BaseFormServerValidation>,
        AddRoleData
    >(createRole, {
        onSuccess: async () => {
            showSuccessToast({ title: "Role has been added" });
            await queryClient.refetchQueries({ queryKey: ROLES_QUERY_KEYS.LIST(rolesFilters) });
            onClose();
        },
    });

    const onCloseDialog = () => {
        reset();
        onClose();
    };

    const onSubmit = async (values: AddRoleData) => {
        try {
            await mutateAsync({ name: values.name });
        } catch (err) {}
    };

    return (
        <>
            <TextButton
                className="flex items-center text-md font-medium whitespace-nowrap"
                variant="transparent"
                size="thin"
                type="button"
                onClick={onOpen}
                data-testid="add-role-dialog-button"
                text="Create role"
                endIcon={<PlusIcon className="w-6 h-6" />}
            />
            <FormDialog
                schema={schema}
                defaultValues={DEFAULT_VALUES}
                onSubmit={onSubmit}
                isOpen={isOpen}
                onClose={onCloseDialog}
                onCancel={onCloseDialog}
                title="Add role"
                submitText="Save"
                couldCloseOnBackdrop
                couldCloseOnEsc
            >
                <AddRoleFormContent error={error} />
            </FormDialog>
        </>
    );
};

export default observer(AddRoleDialog);
