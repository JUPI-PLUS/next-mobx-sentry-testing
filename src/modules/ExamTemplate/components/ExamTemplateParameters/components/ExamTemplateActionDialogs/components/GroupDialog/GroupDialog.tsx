// libs
import { FC, useMemo } from "react";
import { AxiosError } from "axios";
import { useMutation } from "react-query";

// helpers
import { schema } from "./schema";
import { createParamsGroup, editParamsGroup } from "../../../../../../../../api/paramsGroups";
import { queryClient } from "../../../../../../../../../pages/_app";

// models
import { BaseFormServerValidation, ServerResponse } from "../../../../../../../../shared/models/axios";
import { GroupDialogProps, ParamsGroupMutationData, ParamsGroupMutationResponse } from "./models";

// constants
import { EXAM_TEMPLATE_QUERY_KEYS } from "../../../../../../../../shared/constants/queryKeys";

// components
import FormDialog from "../../../../../../../../components/uiKit/Dialog/FormDialog";
import GroupForm from "./GroupForm";
import { showErrorToast, showSuccessToast } from "../../../../../../../../components/uiKit/Toast/helpers";

const GroupDialog: FC<GroupDialogProps> = ({
    isOpen,
    onClose,
    dialogTitle,
    selectedGroup,
    onAddGroup,
    onEditGroup,
    examTemplateUUID,
}) => {
    const {
        mutateAsync: mutateAsyncCreate,
        isError: isErrorCreate,
        error: errorCreate,
    } = useMutation<
        ServerResponse<ParamsGroupMutationResponse>,
        AxiosError<BaseFormServerValidation>,
        ParamsGroupMutationData
    >(createParamsGroup, {
        onSuccess: queryData => {
            const { name, uuid } = queryData.data.data;
            onAddGroup({ group_name: name, group_uuid: uuid });
            showSuccessToast({ title: `Group ${name} has been created` });
        },
        onError: async errorData => {
            await queryClient.refetchQueries(EXAM_TEMPLATE_QUERY_KEYS.PARAMS(examTemplateUUID));
            showErrorToast({ title: errorData.response?.data.message });
        },
    });

    const {
        mutateAsync: mutateAsyncEdit,
        isError: isErrorEdit,
        error: errorEdit,
    } = useMutation<
        ServerResponse<ParamsGroupMutationResponse>,
        AxiosError<BaseFormServerValidation>,
        ParamsGroupMutationData
    >(editParamsGroup(selectedGroup?.group_uuid as string), {
        onSuccess: queryData => {
            const { name, uuid } = queryData.data.data;
            onEditGroup({ group_name: name, group_uuid: uuid });
            showSuccessToast({ title: `Group ${name} has been updated` });
        },
        onError: async errorData => {
            await queryClient.refetchQueries(EXAM_TEMPLATE_QUERY_KEYS.PARAMS(examTemplateUUID));
            showErrorToast({ title: errorData.response?.data.message });
        },
    });

    const defaultValues = useMemo(() => ({ name: selectedGroup ? selectedGroup.group_name : "" }), [selectedGroup]);

    const onSubmit = async (formData: { name: string }) => {
        try {
            if (selectedGroup) {
                await mutateAsyncEdit({ name: formData.name, exam_template_uuid: examTemplateUUID });
            } else {
                await mutateAsyncCreate({ name: formData.name, exam_template_uuid: examTemplateUUID });
            }
            onClose();
        } catch (e) {}
    };

    if (!isOpen) return null;

    return (
        <FormDialog
            isOpen={isOpen}
            title={dialogTitle}
            submitText="Save"
            schema={schema}
            onSubmit={onSubmit}
            defaultValues={defaultValues}
            onClose={onClose}
        >
            <GroupForm isError={isErrorCreate || isErrorEdit} errors={errorCreate || errorEdit} />
        </FormDialog>
    );
};
export default GroupDialog;
