// libs
import React, { useId } from "react";
import { useMutation, useQuery } from "react-query";
import { observer } from "mobx-react";
import { AxiosError } from "axios";
import { useRouter } from "next/router";

// stores
import { useWorkplacesStore } from "../../../../store";

// api
import { deleteWorkplace, getExamTemplatesByWorkplaceUUID } from "../../../../../../api/workplaces";

// helpers
import { useDisclosure } from "../../../../../../shared/hooks/useDisclosure";
import { queryClient } from "../../../../../../../pages/_app";

// models
import { BaseFormServerValidation, ServerResponse } from "../../../../../../shared/models/axios";

// constants
import { WORKPLACE_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";
import { ROUTES } from "../../../../../../shared/constants/routes";
import { DELETE_WORKPLACE_STALE_TIME } from "../../../../../../shared/constants/queries";

// components
import { showSuccessToast } from "../../../../../../components/uiKit/Toast/helpers";
import Dialog from "../../../../../../components/uiKit/Dialog/Dialog";

const DeleteWorkplaceDialogs = () => {
    const id = useId();
    const { push } = useRouter();

    const {
        workplacesStore: { selectedWorkplace, lastRequestedQueryKey, setupSelectedWorkplace },
    } = useWorkplacesStore();

    const workplaceUUID = selectedWorkplace!.uuid;

    const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();

    const {
        isOpen: isDeleteWithValidationDialogOpen,
        onOpen: onDeleteWithValidationDialogOpen,
        onClose: onDeleteWithValidationDialogClose,
    } = useDisclosure();

    useQuery(
        [WORKPLACE_QUERY_KEYS.EXAM_TEMPLATES_BY_UUID(workplaceUUID), id],
        getExamTemplatesByWorkplaceUUID(workplaceUUID),
        {
            enabled: Boolean(workplaceUUID),
            refetchOnWindowFocus: true,
            staleTime: DELETE_WORKPLACE_STALE_TIME,
            select: queryData => queryData.data.data,
            onSuccess: queryData => {
                if (queryData.length) {
                    onDeleteDialogClose();
                    onDeleteWithValidationDialogOpen();
                } else {
                    onDeleteWithValidationDialogClose();
                    onDeleteDialogOpen();
                }
            },
        }
    );

    const { mutateAsync, isLoading } = useMutation<ServerResponse, AxiosError<BaseFormServerValidation>>(
        deleteWorkplace(workplaceUUID),
        {
            async onError() {
                await queryClient.refetchQueries([WORKPLACE_QUERY_KEYS.EXAM_TEMPLATES_BY_UUID(workplaceUUID), id]);
            },
            async onSuccess() {
                showSuccessToast({ title: `Workplace ${selectedWorkplace!.name} has been deleted` });
                onDeleteDialogClose();
                await queryClient.refetchQueries(lastRequestedQueryKey);
                onCloseDialog();
            },
        }
    );

    const onCloseDialog = () => {
        setupSelectedWorkplace(null);
    };

    const onCloseDeleteDialog = () => {
        onCloseDialog();
        onDeleteDialogClose();
    };

    const onCloseDeleteWithValidationDialog = () => {
        onCloseDialog();
        onDeleteWithValidationDialogClose();
    };

    const onEditWorkplace = async () => {
        await push({ pathname: ROUTES.workplaces.edit.route, query: { uuid: workplaceUUID } });
        onCloseDeleteWithValidationDialog();
    };

    const onSubmitDelete = async () => {
        try {
            await mutateAsync();
        } catch (e) {}
    };

    return (
        <>
            <Dialog
                isOpen={isDeleteDialogOpen}
                isSubmitButtonDisabled={isLoading}
                isCancelButtonDisabled={isLoading}
                onClose={onCloseDeleteDialog}
                onCancel={onCloseDeleteDialog}
                onSubmit={onSubmitDelete}
                title="Delete workplace"
                submitText="Delete"
                cancelText="Cancel"
            >
                <p data-testid="delete-workplace-dialog-text">
                    Are you sure you want to delete <span className="font-bold">{selectedWorkplace!.name}</span>{" "}
                    workplace?
                </p>
            </Dialog>
            <Dialog
                title="Delete workplace"
                isOpen={isDeleteWithValidationDialogOpen}
                submitText="Edit"
                cancelText="Cancel"
                onCancel={onCloseDeleteWithValidationDialog}
                onClose={onCloseDeleteWithValidationDialog}
                onSubmit={onEditWorkplace}
            >
                <p data-testid="restrict-delete-workplace-dialog-text">
                    You cannot delete <span className="font-bold">{selectedWorkplace!.name}</span> workplace because it
                    has attached examination templates. Please detach examination templates first.
                </p>
            </Dialog>
        </>
    );
};

export default observer(DeleteWorkplaceDialogs);
