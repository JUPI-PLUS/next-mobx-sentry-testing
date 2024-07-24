// libs
import React, { FC } from "react";
import { useMutation } from "react-query";
import { observer } from "mobx-react";
import { AxiosError } from "axios";

// components
import OptionDialog from "../OptionDialog/OptionDialog";

// api
import { createParameterOption } from "../../../../api/parameterOptions";

// helpers
import { showSuccessToast } from "../../../../components/uiKit/Toast/helpers";
import { queryClient } from "../../../../../pages/_app";

// store
import { useParameterOptionsStore } from "../../store";

// models
import { BaseFormServerValidation, ServerResponse } from "../../../../shared/models/axios";
import { OptionFormData } from "../../models";
import { CreateParameterOptionProps } from "./models";
import { ParameterOption } from "../ParameterOptionsTable/models";

const defaultValues = {
    name: "",
};

const CreateParameterOption: FC<CreateParameterOptionProps> = ({ isOpen, onClose }) => {
    const {
        parameterOptionsStore: { lastRequestedQueryKey },
    } = useParameterOptionsStore();
    const { mutateAsync, error, reset } = useMutation<
        ServerResponse<ParameterOption>,
        AxiosError<BaseFormServerValidation>,
        OptionFormData
    >(createParameterOption, {
        async onSuccess({ data }) {
            onClose();
            showSuccessToast({ title: `Option ${data.data.name} has been created` });
            await queryClient.refetchQueries(lastRequestedQueryKey);
        },
    });
    const onSubmit = async (formData: OptionFormData) => {
        try {
            await mutateAsync(formData);
        } catch (e) {}
    };

    const onDialogClose = () => {
        reset();
        onClose();
    };

    return (
        <OptionDialog
            isOpen={isOpen}
            title="Create option"
            defaultValues={defaultValues}
            submitText="Create"
            onSubmit={onSubmit}
            onClose={onDialogClose}
            error={error}
        />
    );
};

export default observer(CreateParameterOption);
