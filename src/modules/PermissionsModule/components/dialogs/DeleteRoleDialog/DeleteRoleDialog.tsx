import { AxiosError } from "axios";
import { observer } from "mobx-react";
import { useMutation } from "react-query";
import { queryClient } from "../../../../../../pages/_app";
import { deleteRole } from "../../../../../api/roles";
import Dialog from "../../../../../components/uiKit/Dialog/Dialog";
import { showErrorToast, showSuccessToast } from "../../../../../components/uiKit/Toast/helpers";
import { rollbackErrorMessage } from "../../../../../shared/errors/errorMessages";
import { BaseFormServerValidation, ServerResponse } from "../../../../../shared/models/axios";
import { usePermissionsStore } from "../../../store";
import { DeleteRoleData } from "./models";
import { ROLES_QUERY_KEYS } from "../../../../../shared/constants/queryKeys";
import { TextButton } from "../../../../../components/uiKit/Button/Button";
import { useDisclosure } from "../../../../../shared/hooks/useDisclosure";
import DeleteIcon from "../../../../../components/uiKit/Icons/DeleteIcon";

const DeleteRoleDialog = () => {
    const {
        permissionsStore: { activeRole, resetActiveRole, rolesFilters },
    } = usePermissionsStore();

    const { isOpen, onClose, onOpen } = useDisclosure();
    const { isOpen: isOpenErrorDialog, onClose: onCloseErrorDialog, onOpen: onOpenErrorDialog } = useDisclosure();

    const { mutateAsync, isLoading } = useMutation<
        ServerResponse<void>,
        AxiosError<BaseFormServerValidation>,
        DeleteRoleData
    >(deleteRole, {
        onSuccess: async () => {
            showSuccessToast({ title: "Role has been removed" });
            resetActiveRole();
            await queryClient.refetchQueries({ queryKey: ROLES_QUERY_KEYS.LIST(rolesFilters) });

            onClose();
        },
        onError: () => {
            showErrorToast({
                // TODO! Waiting for BE to implement validation
                title: rollbackErrorMessage,
            });
            onClose();
            onOpenErrorDialog();
        },
    });

    const onSubmit = async () => {
        await mutateAsync({ id: activeRole!.id });
    };

    return (
        <>
            <TextButton
                variant="transparent"
                size="thin"
                text="Delete role"
                endIcon={<DeleteIcon className="fill-dark-900" />}
                onClick={onOpen}
                data-testid="delete-role-button"
            />
            <Dialog
                isOpen={isOpen}
                onClose={onClose}
                onCancel={onClose}
                onSubmit={onSubmit}
                isSubmitButtonDisabled={isLoading}
                isCancelButtonDisabled={isLoading}
                submitText="Delete"
                cancelText="Cancel"
                title="Delete role?"
                couldCloseOnBackdrop
                couldCloseOnEsc
            >
                <div className="mb-10">
                    <span>Are you sure you want to delete this role?</span>
                </div>
            </Dialog>
            <Dialog
                isOpen={isOpenErrorDialog}
                onClose={onCloseErrorDialog}
                onCancel={onCloseErrorDialog}
                onSubmit={onCloseErrorDialog}
                submitText="Ok"
                title="Attention!"
                couldCloseOnBackdrop
                couldCloseOnEsc
            >
                <span>Some users have this role, please unfasten users from role before deleting role</span>
            </Dialog>
        </>
    );
};

export default observer(DeleteRoleDialog);
