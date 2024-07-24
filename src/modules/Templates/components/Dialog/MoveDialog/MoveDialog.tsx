// libs
import React, { useMemo } from "react";
import { useMutation } from "react-query";
import { observer } from "mobx-react";
import { AxiosError } from "axios";

// models
import { MoveExamKitRequest, MoveGroupRequest, TemplateRequestResponse } from "../../../models";
import { BaseFormServerValidation, ServerResponse } from "../../../../../shared/models/axios";
import { ExamTemplate } from "../../../../../shared/models/business/exam";
import { KitTemplate } from "../../../../KitTemplate/components/KitForm/models";
import { TemplateTypeEnum } from "../../../../../shared/models/business/template";

// constants
import { TEMPLATES_MESSAGES } from "../../../../../shared/constants/templates";
import { TEMPLATES_QUERY_KEYS } from "../../../../../shared/constants/queryKeys";
import { GROUP_NESTED_LVL_MORE_THEN_MAX } from "../../../../../shared/errors/templates";

// stores
import { useTemplatesStore } from "../../../store";

// helpers
import { showErrorToast, showSuccessToast } from "../../../../../components/uiKit/Toast/helpers";
import { moveGroupToParent } from "../../../../../api/templates";
import { moveKitTemplatesToGroup } from "../../../../../api/kits";
import { moveExamTemplatesToGroup } from "../../../../../api/exams";
import { queryClient } from "../../../../../../pages/_app";

// components
import Dialog from "../../../../../components/uiKit/Dialog/Dialog";

const MoveDialog = () => {
    const {
        templatesStore: {
            itemDetails,
            cutItemDetails,
            onCloseDialog,
            cleanupUpdatingPositionTemplate,
            getTemplatesQuery,
        },
    } = useTemplatesStore();

    const { mutateAsync: moveGroup, isLoading: isMoveGroupLoading } = useMutation<
        ServerResponse<TemplateRequestResponse>,
        AxiosError<BaseFormServerValidation>,
        MoveGroupRequest
    >(moveGroupToParent, {
        onSuccess() {
            showSuccessToast({
                title: TEMPLATES_MESSAGES.GROUP_WAS_MOVED_INTO_GROUP(cutItemDetails!.name, itemDetails.name!),
            });
            cleanupUpdatingPositionTemplate();
        },
        onError(error) {
            const deleteErrorMessage = error.response?.data.errors[0].message[0] as string;
            if (deleteErrorMessage === GROUP_NESTED_LVL_MORE_THEN_MAX) {
                showErrorToast({
                    title: TEMPLATES_MESSAGES.GROUP_CANNOT_MOVE(cutItemDetails!.name),
                    message: TEMPLATES_MESSAGES.GROUP_NESTED_LVL_MORE_THEN_MAX,
                });
            } else {
                showErrorToast({ title: TEMPLATES_MESSAGES.GROUP_CANNOT_MOVE(cutItemDetails!.name) });
            }
        },
    });

    const { mutateAsync: moveKit, isLoading: isMoveKitLoading } = useMutation<
        ServerResponse<KitTemplate>,
        AxiosError<BaseFormServerValidation>,
        MoveExamKitRequest
    >(moveKitTemplatesToGroup, {
        onSuccess() {
            showSuccessToast({
                title: TEMPLATES_MESSAGES.KIT_WAS_MOVED_INTO_GROUP(cutItemDetails!.name, itemDetails.name!),
            });
            cleanupUpdatingPositionTemplate();
        },
        onError() {
            showErrorToast({ title: TEMPLATES_MESSAGES.KIT_CANNOT_MOVE(cutItemDetails!.name) });
        },
    });

    const { mutateAsync: moveExam, isLoading: isMoveExamLoading } = useMutation<
        ServerResponse<ExamTemplate>,
        AxiosError<BaseFormServerValidation>,
        MoveExamKitRequest
    >(moveExamTemplatesToGroup, {
        onSuccess() {
            showSuccessToast({
                title: TEMPLATES_MESSAGES.EXAM_WAS_MOVED_INTO_GROUP(cutItemDetails!.name, itemDetails.name!),
            });
            cleanupUpdatingPositionTemplate();
        },
        onError() {
            showErrorToast({ title: TEMPLATES_MESSAGES.EXAM_CANNOT_MOVE(cutItemDetails!.name) });
        },
    });

    const isLoading = isMoveGroupLoading || isMoveKitLoading || isMoveExamLoading;

    const itemType = useMemo(() => {
        switch (cutItemDetails!.item_type) {
            case TemplateTypeEnum.GROUP:
                return "group";
            case TemplateTypeEnum.KIT:
                return "kit template";
            case TemplateTypeEnum.EXAM:
                return "exam template";
            default:
                return "";
        }
    }, [cutItemDetails]);

    const onSubmit = async () => {
        try {
            if (cutItemDetails) {
                switch (cutItemDetails.item_type) {
                    case TemplateTypeEnum.GROUP:
                        await moveGroup({
                            body: { parent_uuid: itemDetails.uuid || null },
                            uuid: cutItemDetails.uuid,
                        });
                        break;
                    case TemplateTypeEnum.KIT:
                        await moveKit({
                            body: { group_uuid: itemDetails.uuid || null },
                            uuid: cutItemDetails.uuid,
                        });
                        break;
                    case TemplateTypeEnum.EXAM:
                        await moveExam({
                            body: { group_uuid: itemDetails.uuid || null },
                            uuid: cutItemDetails.uuid,
                        });
                        break;
                    default:
                        break;
                }
            }
            onCloseDialog();
            await queryClient.refetchQueries(TEMPLATES_QUERY_KEYS.LIST(getTemplatesQuery()));
        } catch (error) {}
    };

    return (
        <Dialog
            isOpen
            title={`Paste ${itemType}`}
            submitText="Paste"
            cancelText="Cancel"
            onSubmit={onSubmit}
            isCancelButtonDisabled={isLoading}
            isSubmitButtonDisabled={isLoading}
            onClose={onCloseDialog}
            onCancel={onCloseDialog}
        >
            <div data-testid="template-paste-text">
                Are you sure you want to paste <span className="font-bold">{cutItemDetails!.name}</span> {itemType} into{" "}
                <span className="font-bold">{itemDetails.name}</span> group?
            </div>
        </Dialog>
    );
};

export default observer(MoveDialog);
