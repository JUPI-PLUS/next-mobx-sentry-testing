// libs
import { FC } from "react";
import { useMutation } from "react-query";
import { observer } from "mobx-react";
import { AxiosError } from "axios";

// stores
import { useTemplatesStore } from "../../../../store";

// helpers
import { showErrorToast, showSuccessToast } from "../../../../../../components/uiKit/Toast/helpers";
import { createGroup } from "../../../../../../api/templates";
import { queryClient } from "../../../../../../../pages/_app";
import { nameSchema } from "../schema";

// models
import { TemplateRequestResponse } from "../../../../models";
import { BaseFormServerValidation, ServerResponse } from "../../../../../../shared/models/axios";

// constants
import { TEMPLATES_MESSAGES } from "../../../../../../shared/constants/templates";
import { TEMPLATES_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";

// components
import FormDialog from "../../../../../../components/uiKit/Dialog/FormDialog";
import FormInput from "../../../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";

const FormAddDialog: FC = () => {
    const {
        templatesStore: { itemDetails, parentGroupUUID, getTemplatesQuery, onCloseDialog },
    } = useTemplatesStore();

    const { mutateAsync } = useMutation<
        ServerResponse<TemplateRequestResponse>,
        AxiosError<BaseFormServerValidation>,
        {
            name: string;
            parent_uuid?: string;
        }
    >(createGroup, {
        onSuccess({ data }) {
            showSuccessToast({ title: TEMPLATES_MESSAGES.GROUP_CREATED(data.data.name) });
            onCloseDialog();
        },
        onError() {
            showErrorToast({
                title: TEMPLATES_MESSAGES.GROUP_CANNOT_CREATE,
                message: TEMPLATES_MESSAGES.MAYBE_TARGET_GROUP_WAS_DELETED,
            });
        },
    });

    const onSubmit = async (formData: { name: string }) => {
        try {
            await mutateAsync({
                name: formData.name,
                parent_uuid: itemDetails.uuid || parentGroupUUID || undefined,
            });
            if (!itemDetails.uuid) {
                await queryClient.refetchQueries(TEMPLATES_QUERY_KEYS.LIST(getTemplatesQuery()));
            }
        } catch (error) {}
    };

    return (
        <FormDialog
            isOpen
            title="Add group"
            schema={nameSchema}
            defaultValues={{ name: "" }}
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
                data-testid="add-template-name-input"
            />
        </FormDialog>
    );
};

export default observer(FormAddDialog);
