// libs
import { FC } from "react";
import { useMutation } from "react-query";
import { observer } from "mobx-react";
import { AxiosError } from "axios";

// stores
import { useTemplatesStore } from "../../../../store";

// models
import { BaseFormServerValidation, ServerResponse } from "../../../../../../shared/models/axios";
import { TemplateRequestResponse } from "../../../../models";

// constants
import { TEMPLATES_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";
import { TEMPLATES_MESSAGES } from "../../../../../../shared/constants/templates";

// helpers
import { showSuccessToast } from "../../../../../../components/uiKit/Toast/helpers";
import { patchTemplate } from "../../../../../../api/templates";
import { nameSchema } from "../schema";
import { queryClient } from "../../../../../../../pages/_app";

// components
import FormDialog from "../../../../../../components/uiKit/Dialog/FormDialog";
import FormInput from "../../../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";

const FormGroupNameDialog: FC = () => {
    const {
        templatesStore: {
            itemDetails: { name = "", uuid = "" },
            onCloseDialog,
            getTemplatesQuery,
        },
    } = useTemplatesStore();

    const { mutateAsync: editGroupName } = useMutation<
        ServerResponse<TemplateRequestResponse>,
        AxiosError<BaseFormServerValidation>,
        { name: string }
    >(patchTemplate(uuid), {
        onSuccess({ data }) {
            showSuccessToast({ title: TEMPLATES_MESSAGES.GROUP_UPDATED(data.data.name) });
            onCloseDialog();
        },
    });

    const onSubmit = async (formData: { name: string }) => {
        try {
            await editGroupName(formData);
            await queryClient.refetchQueries(TEMPLATES_QUERY_KEYS.LIST(getTemplatesQuery()));
        } catch (error) {}
    };

    return (
        <FormDialog
            isOpen
            title="Edit group"
            schema={nameSchema}
            defaultValues={{ name: name }}
            submitText="Submit"
            cancelText="Cancel"
            onSubmit={onSubmit}
            onClose={onCloseDialog}
            onCancel={onCloseDialog}
        >
            <FormInput
                autoFocus
                label="Name"
                name="name"
                type="text"
                containerClassName="mb-6"
                data-testid="edit-template-name-input"
            />
        </FormDialog>
    );
};

export default observer(FormGroupNameDialog);
