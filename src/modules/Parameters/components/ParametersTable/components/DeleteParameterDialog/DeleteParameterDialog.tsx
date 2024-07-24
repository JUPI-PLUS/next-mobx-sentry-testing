import React, { useId } from "react";
import { useMutation, useQuery } from "react-query";
import { PARAMETER_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";
import { useParametersStore } from "../../../../store";
import Dialog from "../../../../../../components/uiKit/Dialog/Dialog";
import { useDisclosure } from "../../../../../../shared/hooks/useDisclosure";
import Notification from "../../../../../../components/uiKit/Notification/Notification";
import { deleteParameter, getExamTemplatesByParamUUID } from "../../../../../../api/parameters";
import { DELETE_OPTION_STALE_TIME } from "../../../../../../shared/constants/queries";
import ExaminationTemplateItem from "./components/ExaminationTemplateItem/ExaminationTemplateItem";
import { observer } from "mobx-react";
import { BaseFormServerValidation, ServerResponse } from "../../../../../../shared/models/axios";
import { AxiosError } from "axios";
import { queryClient } from "../../../../../../../pages/_app";
import { showSuccessToast } from "../../../../../../components/uiKit/Toast/helpers";

const DeleteParameterDialog = () => {
    const id = useId();
    const {
        parametersStore: { selectedParameter, lastRequestedQueryKey, setupSelectedParameter, setupParameterAction },
    } = useParametersStore();
    const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();
    const {
        isOpen: isDeleteValidationDialogOpen,
        onOpen: onDeleteValidationDialogOpen,
        onClose: onDeleteValidationDialogClose,
    } = useDisclosure();

    const { data = [] } = useQuery(
        [PARAMETER_QUERY_KEYS.EXAM_TEMPLATES_BY_UUID(selectedParameter!.uuid), id],
        getExamTemplatesByParamUUID(selectedParameter!.uuid),
        {
            enabled: Boolean(selectedParameter?.uuid),
            refetchOnWindowFocus: true,
            staleTime: DELETE_OPTION_STALE_TIME,
            select: queryData => queryData.data.data,
            onSuccess: queryData => {
                if (queryData.length) {
                    onDeleteDialogClose();
                    onDeleteValidationDialogOpen();
                } else {
                    onDeleteValidationDialogClose();
                    onDeleteDialogOpen();
                }
            },
        }
    );

    const { mutate, isLoading } = useMutation<ServerResponse, AxiosError<BaseFormServerValidation>>(
        deleteParameter(selectedParameter!.uuid),
        {
            async onError() {
                await queryClient.refetchQueries([
                    PARAMETER_QUERY_KEYS.EXAM_TEMPLATES_BY_UUID(selectedParameter!.uuid),
                    id,
                ]);
            },
            async onSuccess() {
                onDeleteDialogClose();
                showSuccessToast({ title: `Parameter ${selectedParameter!.name} has been deleted` });
                await queryClient.refetchQueries(lastRequestedQueryKey);
                onCloseDialog();
            },
        }
    );

    const onCloseDialog = () => {
        setupSelectedParameter(null);
        setupParameterAction(null);
    };

    const onCloseDeleteParameterDialog = () => {
        onCloseDialog();
        onDeleteDialogClose();
    };

    const onCloseValidationDeleteOptionDialog = () => {
        onCloseDialog();
        onDeleteValidationDialogClose();
    };

    const onSubmitDelete = async () => {
        await mutate();
    };

    return (
        <>
            <Dialog
                isOpen={isDeleteDialogOpen}
                isSubmitButtonDisabled={isLoading}
                isCancelButtonDisabled={isLoading}
                onClose={onCloseDeleteParameterDialog}
                onCancel={onCloseDeleteParameterDialog}
                onSubmit={onSubmitDelete}
                title="Delete parameter"
                submitText="Delete"
                cancelText="Cancel"
            >
                <p>
                    Are you sure you want to delete <span className="font-bold">{selectedParameter!.name}</span>{" "}
                    parameter?
                </p>
            </Dialog>
            <Dialog
                title="Delete parameter"
                isOpen={isDeleteValidationDialogOpen}
                submitText="Ok"
                onClose={onCloseValidationDeleteOptionDialog}
                onSubmit={onCloseValidationDeleteOptionDialog}
                containerClass="w-full max-w-xl max-h-5/6"
            >
                <>
                    <Notification variant="error">
                        <p>
                            You cannot delete <span className="font-bold">{selectedParameter!.name}</span> parameter,
                            because it is used in the following exam templates. You need to manually remove the
                            parameter in the found analyses
                        </p>
                    </Notification>
                    <ul className="mt-6">
                        {data.map(({ uuid, code, status_id, name }) => {
                            return (
                                <ExaminationTemplateItem
                                    key={uuid}
                                    name={name}
                                    code={code}
                                    statusId={status_id}
                                    uuid={uuid}
                                />
                            );
                        })}
                    </ul>
                </>
            </Dialog>
        </>
    );
};

export default observer(DeleteParameterDialog);
