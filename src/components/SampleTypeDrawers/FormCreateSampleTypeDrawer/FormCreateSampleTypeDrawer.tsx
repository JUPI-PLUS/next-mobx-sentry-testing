// libs
import React, { FC } from "react";
import { observer } from "mobx-react";
import { useMutation } from "react-query";
import { AxiosError } from "axios";

// models
import { SubmitCreateSampleTypeData } from "./models";
import { BaseFormServerValidation, ServerResponse } from "../../../shared/models/axios";
import { SampleType } from "../../../shared/models/business/sampleTypes";

// schema
import { schema } from "../schema";

// helpers
import { createSampleType } from "../../../api/sampleTypes";
import { queryClient } from "../../../../pages/_app";

// stores
import { useSampleTypesStore } from "../../../modules/SampleTypes/store";

// components
import FormDrawer from "../../uiKit/Drawer/FormDrawer";
import { showSuccessToast } from "../../uiKit/Toast/helpers";
import FormSampleTypesInputs from "../components/FormSampleTypeInputs/FormSampleTypeInputs";

const defaultFormValues: SubmitCreateSampleTypeData = {
    code: "",
    name: "",
};

const FormCreateSampleTypeDrawer: FC = () => {
    const {
        sampleTypesStore: { lastRequestedQueryKey, cleanupSelectedSampleType },
    } = useSampleTypesStore();

    const { mutateAsync, isLoading, error } = useMutation<
        ServerResponse<SampleType>,
        AxiosError<BaseFormServerValidation>,
        Omit<SampleType, "id">
    >(createSampleType, {
        async onSuccess({ data }) {
            showSuccessToast({ title: `Sample type ${data.data.name} has been created` });
            cleanupSelectedSampleType();
            await queryClient.refetchQueries(lastRequestedQueryKey);
        },
    });

    const onDrawerSubmit = async (formData: SubmitCreateSampleTypeData) => {
        try {
            await mutateAsync(formData);
        } catch {}
    };

    const onCloseDrawer = () => {
        cleanupSelectedSampleType();
    };

    return (
        <FormDrawer
            onSubmit={onDrawerSubmit}
            onClose={onCloseDrawer}
            onCancel={onCloseDrawer}
            size="lg"
            side="right"
            title="Add sample type"
            schema={schema}
            defaultValues={defaultFormValues}
            submitText="Save"
            disableOnCleanFields
            couldCloseOnBackdrop
            isOpen
        >
            <FormSampleTypesInputs error={error} isLoading={isLoading} />
        </FormDrawer>
    );
};

export default observer(FormCreateSampleTypeDrawer);
