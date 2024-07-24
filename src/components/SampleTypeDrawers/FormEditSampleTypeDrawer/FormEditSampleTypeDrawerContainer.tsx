// libs
import React, { FC } from "react";
import { observer } from "mobx-react";
import { useMutation, useQuery } from "react-query";
import { AxiosError } from "axios";

// models
import { FormEditSampleTypeDrawerContainerProps, SubmitEditSampleTypeData } from "./models";
import { SampleType } from "../../../shared/models/business/sampleTypes";
import { BaseFormServerValidation, ServerResponse } from "../../../shared/models/axios";

// schema
import { schema } from "../schema";

// helpers
import { patchSampleType } from "../../../api/sampleTypes";
import { queryClient } from "../../../../pages/_app";
import { toLookupList } from "../../../shared/utils/lookups";
import { getExamTemplateStatuses } from "../../../api/dictionaries";

// stores
import { useSampleTypesStore } from "../../../modules/SampleTypes/store";
import { useParametersStore } from "../../../modules/Parameters/store";

// constants
import { DICTIONARIES_QUERY_KEYS } from "../../../shared/constants/queryKeys";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../shared/constants/queries";

// components
import FormDrawer from "../../uiKit/Drawer/FormDrawer";
import { showSuccessToast } from "../../uiKit/Toast/helpers";
import FormEditSampleTypeDrawer from "./FormEditSampleTypeDrawer";

const FormEditSampleTypeDrawerContainer: FC<FormEditSampleTypeDrawerContainerProps> = ({ sampleType }) => {
    const {
        sampleTypesStore: { lastRequestedQueryKey, cleanupSelectedSampleType },
    } = useSampleTypesStore();

    const {
        parametersStore: { setupExaminationTemplateStatusesLookup },
    } = useParametersStore();

    useQuery(DICTIONARIES_QUERY_KEYS.EXAM_TEMPLATE_STATUSES, getExamTemplateStatuses, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
        onSuccess: queryData => {
            setupExaminationTemplateStatusesLookup(queryData);
        },
    });

    const { mutateAsync, isLoading, error } = useMutation<
        ServerResponse<SampleType>,
        AxiosError<BaseFormServerValidation>,
        Omit<SampleType, "id">
    >(patchSampleType(sampleType.id), {
        async onSuccess({ data }) {
            showSuccessToast({ title: `Sample type ${data.data.name} has been edited` });
            cleanupSelectedSampleType();
            await queryClient.refetchQueries(lastRequestedQueryKey);
        },
    });

    const onDrawerSubmit = async (formData: SubmitEditSampleTypeData) => {
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
            title="Edit sample type"
            schema={schema}
            childrenContainerClass="flex flex-col"
            defaultValues={sampleType}
            submitText="Save"
            disableOnCleanFields
            couldCloseOnBackdrop
            isOpen
        >
            <FormEditSampleTypeDrawer sampleType={sampleType} error={error} isLoading={isLoading} />
        </FormDrawer>
    );
};

export default observer(FormEditSampleTypeDrawerContainer);
