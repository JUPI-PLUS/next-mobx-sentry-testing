// libs
import React from "react";
import { useMutation, useQuery } from "react-query";
import { observer } from "mobx-react";
import { AxiosError } from "axios";

// store
import { useSampleTypesStore } from "../../../store";

// api
import { deleteSampleType, getExamTemplatesBySampleTypeId, getSampleTypeDetails } from "../../../../../api/sampleTypes";

// helpers
import { showErrorToast, showSuccessToast } from "../../../../../components/uiKit/Toast/helpers";
import { queryClient } from "../../../../../../pages/_app";

// models
import { BaseFormServerValidation, ServerResponse } from "../../../../../shared/models/axios";
import { SampleType } from "../../../../../shared/models/business/sampleTypes";

// constants
import { SAMPLE_TYPES_QUERY_KEYS } from "../../../../../shared/constants/queryKeys";

// components
import Dialog from "../../../../../components/uiKit/Dialog/Dialog";
import DeleteDialogContent from "./components/DeleteDialogContent";

const DeleteDialog = () => {
    const {
        sampleTypesStore: { sampleType, lastRequestedQueryKey, cleanupSelectedSampleType },
    } = useSampleTypesStore();

    const { mutateAsync, isLoading } = useMutation<ServerResponse, AxiosError<BaseFormServerValidation>, number>(
        deleteSampleType,
        {
            onSuccess() {
                showSuccessToast({ title: `Sample type ${sampleType!.name} has been deleted` });
            },
            onError() {
                showErrorToast({ title: `Sample type ${sampleType!.name} has been already deleted` });
            },
            async onSettled() {
                await queryClient.refetchQueries(lastRequestedQueryKey);
            },
        }
    );

    const { isFetching: isSampleTypeFetching } = useQuery<ServerResponse<SampleType>, AxiosError, SampleType>(
        SAMPLE_TYPES_QUERY_KEYS.DETAILS(sampleType!.id!),
        getSampleTypeDetails(sampleType!.id!),
        {
            onError: async () => {
                showErrorToast({ title: `Sample type ${sampleType!.name} not found` });
                cleanupSelectedSampleType();
                await queryClient.refetchQueries(lastRequestedQueryKey);
            },
            refetchOnWindowFocus: true,
        }
    );

    const { data: examTemplatesList = [], isFetching: isExamTemplatesListFetching } = useQuery(
        SAMPLE_TYPES_QUERY_KEYS.EXAM_TEMPLATES_BY_ID(sampleType!.id!),
        getExamTemplatesBySampleTypeId(sampleType!.id!),
        {
            select: queryData => queryData.data.data,
            refetchOnWindowFocus: true,
        }
    );

    const isDeleteAvailable = examTemplatesList.length === 0 || isExamTemplatesListFetching;

    const onSubmitDelete = async () => {
        if (isDeleteAvailable) {
            try {
                await mutateAsync(sampleType!.id);
            } catch {}
        }
        cleanupSelectedSampleType();
    };

    return (
        <Dialog
            title="Delete sample type"
            isOpen
            containerClass="max-w-lg max-h-5/6"
            childContainerClass="flex"
            isSubmitButtonDisabled={isLoading || isSampleTypeFetching || isExamTemplatesListFetching}
            isCancelButtonDisabled={isLoading || isSampleTypeFetching || isExamTemplatesListFetching}
            submitText={isDeleteAvailable ? "Delete" : "OK"}
            cancelText={isDeleteAvailable ? "Cancel" : undefined}
            onClose={cleanupSelectedSampleType}
            onCancel={cleanupSelectedSampleType}
            onSubmit={onSubmitDelete}
        >
            <DeleteDialogContent
                isDeleteAvailable={isDeleteAvailable}
                examTemplatesList={examTemplatesList}
                isLoading={isSampleTypeFetching || isExamTemplatesListFetching}
                sampleTypeName={sampleType!.name}
            />
        </Dialog>
    );
};

export default observer(DeleteDialog);
