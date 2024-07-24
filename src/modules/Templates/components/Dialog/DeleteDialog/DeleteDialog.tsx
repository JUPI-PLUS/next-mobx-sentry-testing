// libs
import React, { FC } from "react";
import { useMutation, useQuery } from "react-query";
import { observer } from "mobx-react";
import { AxiosError } from "axios";

// stores
import { useTemplatesStore } from "../../../store";

// models
import { TemplateRequestResponse } from "../../../models";
import { BaseFormServerValidation, ServerResponse } from "../../../../../shared/models/axios";
import { TemplateTypeEnum } from "../../../../../shared/models/business/template";

// constants
import { TEMPLATES_MESSAGES } from "../../../../../shared/constants/templates";
import { PARAMETER_QUERY_KEYS, TEMPLATES_QUERY_KEYS } from "../../../../../shared/constants/queryKeys";
import { GROUP_ALREADY_DELETED, GROUP_ALREADY_HAS_CHILDREN } from "../../../../../shared/errors/templates";

// helpers
import { deleteExamTemplate, getKitTemplatesRelations } from "../../../../../api/examTemplates";
import { showErrorToast, showSuccessToast } from "../../../../../components/uiKit/Toast/helpers";
import { deleteTemplate } from "../../../../../api/templates";
import { deleteKitTemplate } from "../../../../../api/kits";
import { queryClient } from "../../../../../../pages/_app";

// components
import Dialog from "../../../../../components/uiKit/Dialog/Dialog";
import Notification from "../../../../../components/uiKit/Notification/Notification";
import KitTemplateRelationItem from "./components/KitTemplateRelationItem/KitTemplateRelationItem";
import DialogBackdrop from "../../../../../components/uiKit/Dialog/components/DialogBackdrop";
import CircularProgressLoader from "../../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";

const DeleteDialog: FC = () => {
    const {
        templatesStore: { itemDetails, onCloseDialog, getTemplatesQuery },
    } = useTemplatesStore();

    const { data: kitTemplatesRelations = [], isLoading: isKitTemplatesRelationsLoading } = useQuery(
        [PARAMETER_QUERY_KEYS.EXAM_TEMPLATES_BY_UUID(itemDetails.uuid!)],
        getKitTemplatesRelations(itemDetails.uuid!),
        {
            onError() {
                showErrorToast({ title: TEMPLATES_MESSAGES.KIT_ALREADY_DELETED(itemDetails.name!) });
                onCloseDialog();
            },
            select: queryData => queryData.data.data,
            enabled: itemDetails.item_type === TemplateTypeEnum.EXAM,
            refetchOnWindowFocus: true,
        }
    );

    const { mutate: deleteGroupMutate, isLoading: isDeletingGroupLoading } = useMutation<
        ServerResponse<TemplateRequestResponse>,
        AxiosError<BaseFormServerValidation>,
        string
    >(deleteTemplate, {
        onSuccess() {
            showSuccessToast({
                title: TEMPLATES_MESSAGES.GROUP_DELETED(itemDetails.name!),
            });
        },
        async onError(error) {
            const deleteErrorMessage = error.response?.data.errors[0].message[0] as string;
            if (deleteErrorMessage === GROUP_ALREADY_DELETED) {
                showErrorToast({ title: TEMPLATES_MESSAGES.GROUP_ALREADY_DELETED(itemDetails.name!) });
            } else if (deleteErrorMessage === GROUP_ALREADY_HAS_CHILDREN) {
                showErrorToast({ title: TEMPLATES_MESSAGES.GROUP_ALREADY_HAS_CHILDREN(itemDetails.name!) });
            }
        },
        onSettled() {
            queryClient.refetchQueries(TEMPLATES_QUERY_KEYS.LIST(getTemplatesQuery()));
            onCloseDialog();
        },
    });

    const { mutate: deleteExamMutate, isLoading: isDeletingExamLoading } = useMutation<
        ServerResponse,
        AxiosError<BaseFormServerValidation>
    >(deleteExamTemplate(itemDetails.uuid!), {
        onSuccess() {
            showSuccessToast({ title: TEMPLATES_MESSAGES.EXAM_DELETED(itemDetails.name!) });
        },
        onError() {
            showErrorToast({ title: TEMPLATES_MESSAGES.EXAM_ALREADY_DELETED(itemDetails.name!) });
        },
        onSettled() {
            queryClient.refetchQueries(TEMPLATES_QUERY_KEYS.LIST(getTemplatesQuery()));
            onCloseDialog();
        },
    });

    const { mutate: deleteKitMutate, isLoading: isDeletingKitLoading } = useMutation<
        ServerResponse,
        AxiosError<BaseFormServerValidation>
    >(deleteKitTemplate(itemDetails.uuid!), {
        onSuccess() {
            showSuccessToast({ title: TEMPLATES_MESSAGES.KIT_DELETED(itemDetails.name!) });
        },
        onError() {
            showErrorToast({ title: TEMPLATES_MESSAGES.KIT_ALREADY_DELETED(itemDetails.name!) });
        },
        onSettled() {
            queryClient.refetchQueries(TEMPLATES_QUERY_KEYS.LIST(getTemplatesQuery()));
            onCloseDialog();
        },
    });

    const onSubmit = () => {
        switch (itemDetails.item_type) {
            case TemplateTypeEnum.GROUP:
                return deleteGroupMutate(itemDetails.uuid!);
            case TemplateTypeEnum.EXAM:
                return deleteExamMutate();
            case TemplateTypeEnum.KIT:
                return deleteKitMutate();
            default:
                return onCloseDialog();
        }
    };

    switch (itemDetails.item_type) {
        case TemplateTypeEnum.GROUP:
            return (
                <Dialog
                    isOpen
                    title="Delete group"
                    submitText="Delete"
                    cancelText="Cancel"
                    onSubmit={onSubmit}
                    isCancelButtonDisabled={isDeletingGroupLoading}
                    isSubmitButtonDisabled={isDeletingGroupLoading}
                    onClose={onCloseDialog}
                    onCancel={onCloseDialog}
                >
                    <div>
                        Are you sure you want to delete <span className="font-bold">{itemDetails.name}</span> group of
                        templates?
                    </div>
                </Dialog>
            );
        case TemplateTypeEnum.KIT:
            return (
                <Dialog
                    isOpen
                    title="Delete kit"
                    submitText="Delete"
                    cancelText="Cancel"
                    onSubmit={onSubmit}
                    isCancelButtonDisabled={isDeletingKitLoading}
                    isSubmitButtonDisabled={isDeletingKitLoading}
                    onClose={onCloseDialog}
                    onCancel={onCloseDialog}
                >
                    <div>
                        Are you sure you want to delete <span className="font-bold">{itemDetails.name}</span> kit
                        template?
                    </div>
                </Dialog>
            );
        case TemplateTypeEnum.EXAM:
            if (isKitTemplatesRelationsLoading) {
                return (
                    <>
                        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed z-50 inset-0 min-w-1/4">
                            <CircularProgressLoader />
                        </div>
                        <DialogBackdrop />
                    </>
                );
            }
            if (kitTemplatesRelations.length !== 0) {
                return (
                    <Dialog
                        isOpen
                        title="Delete exam"
                        submitText="Ok"
                        onClose={onCloseDialog}
                        onSubmit={onCloseDialog}
                        containerClass="w-full max-w-xl max-h-5/6"
                    >
                        <>
                            <Notification variant="error">
                                <p>
                                    You cannot delete <span className="font-bold">{itemDetails.name}</span> exam
                                    template, because it is used into the following kit templates. You have to manually
                                    remove the exam template in the found analyses.
                                </p>
                            </Notification>
                            <ul className="mt-6">
                                {kitTemplatesRelations!.map(kitTemplate => (
                                    <KitTemplateRelationItem key={kitTemplate.uuid} {...kitTemplate} />
                                ))}
                            </ul>
                        </>
                    </Dialog>
                );
            }

            return (
                <Dialog
                    isOpen
                    title="Delete exam template"
                    submitText="Delete"
                    cancelText="Cancel"
                    onSubmit={onSubmit}
                    isCancelButtonDisabled={isDeletingExamLoading}
                    isSubmitButtonDisabled={isDeletingExamLoading}
                    onClose={onCloseDialog}
                    onCancel={onCloseDialog}
                >
                    <div>
                        Are you sure you want to delete <span className="font-bold">{itemDetails.name}</span> exam
                        template?
                    </div>
                </Dialog>
            );
        default:
            return null;
    }
};

export default observer(DeleteDialog);
