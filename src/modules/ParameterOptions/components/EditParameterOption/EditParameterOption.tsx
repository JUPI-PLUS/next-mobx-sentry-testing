// libs
import React from "react";
import { useMutation } from "react-query";
import { observer } from "mobx-react";

// store
import { useParameterOptionsStore } from "../../store";

// models
import { BaseFormServerValidation, ServerResponse } from "../../../../shared/models/axios";
import { AxiosError } from "axios";
import { OptionFormData } from "../../models";

// api
import { updateParameterOption } from "../../../../api/parameterOptions";

// helpers
import { showSuccessToast } from "../../../../components/uiKit/Toast/helpers";
import { queryClient } from "../../../../../pages/_app";

// components
import OptionDialog from "../OptionDialog/OptionDialog";
import { ParameterOption } from "../ParameterOptionsTable/models";

const EditParameterOption = () => {
    const {
        parameterOptionsStore: { lastRequestedQueryKey, option, cleanupSelectedOption },
    } = useParameterOptionsStore();

    const { mutateAsync, error } = useMutation<
        ServerResponse<ParameterOption>,
        AxiosError<BaseFormServerValidation>,
        OptionFormData
    >(updateParameterOption(option!.id), {
        async onSuccess({ data }) {
            cleanupSelectedOption();
            showSuccessToast({ title: `Option ${data.data.name} has been updated` });
            await queryClient.refetchQueries(lastRequestedQueryKey);
        },
    });

    const onSubmit = async (formData: OptionFormData) => {
        try {
            await mutateAsync(formData);
        } catch (e) {}
    };

    return (
        <OptionDialog
            isOpen
            title="Edit option"
            defaultValues={{ name: option?.name ?? "" }}
            submitText="Save"
            onSubmit={onSubmit}
            onClose={cleanupSelectedOption}
            error={error}
        />
    );
};

export default observer(EditParameterOption);
