// libs
import React, { FC, useMemo } from "react";
import { AxiosError } from "axios";
import { useMutation } from "react-query";

// helpers
import { queryClient } from "../../../../../../../../../pages/_app";
import { showErrorToast, showSuccessToast } from "../../../../../../../../components/uiKit/Toast/helpers";
import { deleteParamsGroup } from "../../../../../../../../api/paramsGroups";

// models
import { DeleteDialogProps } from "./models";
import { BaseFormServerValidation, ServerResponse } from "../../../../../../../../shared/models/axios";

// constants
import { EXAM_TEMPLATE_QUERY_KEYS } from "../../../../../../../../shared/constants/queryKeys";

// components
import Dialog from "../../../../../../../../components/uiKit/Dialog/Dialog";

const DeleteDialog: FC<DeleteDialogProps> = ({
    isOpen,
    onClose,
    dialogTitle,
    onDeleteGroup,
    onDeleteParameter,
    selectedGroup,
    selectedParameterName,
    examTemplateUUID,
}) => {
    const { mutateAsync, isLoading } = useMutation<ServerResponse, AxiosError<BaseFormServerValidation>>(
        deleteParamsGroup(selectedGroup?.group_uuid || ""),
        {
            onSuccess: () => {
                showSuccessToast({ title: `Group ${selectedGroup!.group_name} has been deleted` });
                onDeleteGroup();
            },
            onError: async errorData => {
                await queryClient.refetchQueries(EXAM_TEMPLATE_QUERY_KEYS.PARAMS(examTemplateUUID));
                showErrorToast({ title: errorData.response?.data.message });
            },
            onSettled: () => {
                onClose();
            },
        }
    );

    const onSubmit = async () => {
        try {
            if (selectedGroup) {
                await mutateAsync();
            } else {
                showSuccessToast({ title: `Parameter ${selectedParameterName} has been deleted` });
                onDeleteParameter();
            }
        } catch {}
    };

    const dialogText = useMemo(() => {
        if (selectedGroup) {
            return (
                <p>
                    Are you sure you want to delete <span className="font-bold">{selectedGroup.group_name}</span> group?
                </p>
            );
        } else {
            return (
                <p>
                    Are you sure you want to delete <span className="font-bold">{selectedParameterName}</span>{" "}
                    parameter?
                </p>
            );
        }
    }, [selectedGroup, selectedParameterName]);

    return (
        <Dialog
            isOpen={isOpen}
            title={dialogTitle}
            cancelText="Cancel"
            submitText="Delete"
            onSubmit={onSubmit}
            onClose={onClose}
            onCancel={onClose}
            isSubmitButtonDisabled={isLoading}
            isCancelButtonDisabled={isLoading}
        >
            {dialogText}
        </Dialog>
    );
};
export default DeleteDialog;
