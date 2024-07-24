// libs
import React, { useId } from "react";
import { useMutation, useQuery } from "react-query";
import { observer } from "mobx-react";
import Link from "next/link";
import { AxiosError } from "axios";

// store
import { useParameterOptionsStore } from "../../store";

// constants
import { PARAMETER_OPTIONS_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

// api
import { assignedParametersToOption, deleteParameterOption } from "../../../../api/parameterOptions";

// hooks
import { useDisclosure } from "../../../../shared/hooks/useDisclosure";

// components
import Dialog from "../../../../components/uiKit/Dialog/Dialog";
import Notification from "../../../../components/uiKit/Notification/Notification";
import { OutlineButton } from "../../../../components/uiKit/Button/Button";

// helpers
import { showSuccessToast } from "../../../../components/uiKit/Toast/helpers";

// models
import { Parameter } from "../../../../shared/models/business/parameter";
import { BaseFormServerValidation, ServerResponse } from "../../../../shared/models/axios";

// constants
import { ROUTES } from "../../../../shared/constants/routes";
import { DELETE_OPTION_STALE_TIME } from "../../../../shared/constants/queries";
import { queryClient } from "../../../../../pages/_app";

const DeleteOptionDialog = () => {
    const id = useId();
    const {
        parameterOptionsStore: { option, lastRequestedQueryKey, cleanupSelectedOption },
    } = useParameterOptionsStore();
    const { isOpen: isDeleteDialogOpen, onOpen: onDeleteDialogOpen, onClose: onDeleteDialogClose } = useDisclosure();
    const {
        isOpen: isDeleteValidationDialogOpen,
        onOpen: onDeleteValidationDialogOpen,
        onClose: onDeleteValidationDialogClose,
    } = useDisclosure();
    const { data = [] as Parameter[] } = useQuery(
        [PARAMETER_OPTIONS_QUERY_KEYS.ASSIGNED_PARAMETERS_TO_OPTION(option!.id), id],
        assignedParametersToOption(option!.id),
        {
            enabled: Boolean(option),
            refetchOnWindowFocus: true,
            staleTime: DELETE_OPTION_STALE_TIME,
            select(queryData) {
                return queryData.data.data;
            },
            onSuccess(queryData) {
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

    const { mutate, isLoading } = useMutation<ServerResponse, AxiosError<BaseFormServerValidation>, number>(
        deleteParameterOption,
        {
            async onError() {
                await queryClient.refetchQueries([
                    PARAMETER_OPTIONS_QUERY_KEYS.ASSIGNED_PARAMETERS_TO_OPTION(option!.id),
                    id,
                ]);
            },
            async onSuccess() {
                showSuccessToast({ title: `Option ${option!.name} has been deleted` });
                await queryClient.refetchQueries(lastRequestedQueryKey);
                cleanupSelectedOption();
            },
        }
    );

    const onSubmitDelete = () => {
        mutate(option!.id);
    };

    const onCloseDeleteOptionDialog = () => {
        cleanupSelectedOption();
    };

    const onCloseValidationDeleteOptionDialog = () => {
        cleanupSelectedOption();
    };

    return (
        <>
            <Dialog
                title="Delete option"
                isOpen={isDeleteDialogOpen}
                isSubmitButtonDisabled={isLoading}
                isCancelButtonDisabled={isLoading}
                submitText="Delete"
                cancelText="Cancel"
                onClose={onCloseDeleteOptionDialog}
                onCancel={onCloseDeleteOptionDialog}
                onSubmit={onSubmitDelete}
            >
                <p>
                    Are you sure you want to delete <span className="font-bold">{option!.name}</span> option?
                </p>
            </Dialog>
            <Dialog
                title="Delete option"
                isOpen={isDeleteValidationDialogOpen}
                submitText="Ok"
                onClose={onCloseValidationDeleteOptionDialog}
                onSubmit={onCloseValidationDeleteOptionDialog}
                containerClass="w-full max-w-xl max-h-5/6"
            >
                <>
                    <Notification variant="error">
                        <p>
                            You cannot delete <span className="font-bold">{option!.name}</span> option, because it is
                            used in the following parameters. You need to manually remove the option in the found
                            analyses
                        </p>
                    </Notification>
                    <ul className="mt-6">
                        {data.map(({ code, name, uuid }) => {
                            return (
                                <li
                                    key={uuid}
                                    className="grid grid-cols-4 py-4 px-5 items-center border border-inset border-dark-600 rounded-md mb-4"
                                >
                                    <div className="col-span-3">
                                        <div className="text-sm text-dark-800">{code}</div>
                                        <div className="text-md text-dark-900 break-word">{name}</div>
                                    </div>
                                    <div className="col-span-1">
                                        <Link href={{ pathname: ROUTES.parameters.route, hash: uuid }}>
                                            <a target="_blank">
                                                <OutlineButton text="Browse" className="ml-auto" />
                                            </a>
                                        </Link>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </>
            </Dialog>
        </>
    );
};

export default observer(DeleteOptionDialog);
