import { AxiosError } from "axios";
import { observer } from "mobx-react";
import { useMutation } from "react-query";
import { queryClient } from "../../../../../../pages/_app";
import { updateRole } from "../../../../../api/roles";
import { IconButton } from "../../../../../components/uiKit/Button/Button";
import FormDialog from "../../../../../components/uiKit/Dialog/FormDialog";
import PencilIcon from "../../../../../components/uiKit/Icons/PencilIcon";
import { showSuccessToast } from "../../../../../components/uiKit/Toast/helpers";
import { ROLES_QUERY_KEYS } from "../../../../../shared/constants/queryKeys";
import { useDisclosure } from "../../../../../shared/hooks/useDisclosure";
import { BaseFormServerValidation, ServerResponse } from "../../../../../shared/models/axios";
import { Role } from "../../../../../shared/models/roles";
import { UpdateRoleData } from "../../../models";
import { usePermissionsStore } from "../../../store";
import EditRoleFormContent from "./EditRoleFormContent/EditRoleFormContent";
import { schema } from "./schema";

const EditRoleDialog = () => {
    const {
        permissionsStore: { rolesFilters, activeRole, setActiveRole },
    } = usePermissionsStore();

    const { isOpen, onClose, onOpen } = useDisclosure();

    const { mutateAsync, error, reset } = useMutation<
        ServerResponse<Role>,
        AxiosError<BaseFormServerValidation>,
        UpdateRoleData
    >(updateRole(activeRole!.id), {
        onSuccess: async queryData => {
            showSuccessToast({ title: "Role has been updated" });
            await queryClient.refetchQueries({ queryKey: ROLES_QUERY_KEYS.LIST(rolesFilters) });

            setActiveRole(queryData.data.data, false);
            onClose();
        },
    });

    const onSubmit = async (values: UpdateRoleData) => {
        try {
            await mutateAsync({ name: values.name });
        } catch (err) {}
    };

    const onCloseDialog = () => {
        reset();
        onClose();
    };

    return (
        <>
            <IconButton aria-label="Edit role name" variant="transparent" onClick={onOpen} data-testid="edit-role-name">
                <PencilIcon className="w-6 h-6 fill-dark-700 hover:fill-dark-900 transition-colors" />
            </IconButton>
            {isOpen && (
                <FormDialog
                    schema={schema}
                    defaultValues={{ name: activeRole?.name }}
                    onSubmit={onSubmit}
                    isOpen={isOpen}
                    onClose={onCloseDialog}
                    onCancel={onCloseDialog}
                    title="Edit role"
                    submitText="Save"
                    couldCloseOnBackdrop
                    couldCloseOnEsc
                >
                    <EditRoleFormContent error={error} />
                </FormDialog>
            )}
        </>
    );
};

export default observer(EditRoleDialog);
