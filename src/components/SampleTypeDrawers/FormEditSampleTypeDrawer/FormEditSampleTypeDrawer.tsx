// libs
import React, { FC } from "react";
import { observer } from "mobx-react";
import { useQuery } from "react-query";
import { AxiosError } from "axios";
import { useFormContext } from "react-hook-form";

// models
import { FormEditSampleTypeDrawerProps } from "./models";
import { SampleType } from "../../../shared/models/business/sampleTypes";
import { ServerResponse } from "../../../shared/models/axios";

// helpers
import { getExamTemplatesBySampleTypeId, getSampleTypeDetails } from "../../../api/sampleTypes";
import { showErrorToast } from "../../uiKit/Toast/helpers";
import { queryClient } from "../../../../pages/_app";

// stores
import { useSampleTypesStore } from "../../../modules/SampleTypes/store";

// components
import { SAMPLE_TYPES_QUERY_KEYS } from "../../../shared/constants/queryKeys";
import ExamTemplatesList from "./components/ExamTemplatesList/ExamTemplatesList";
import FormSampleTypesInputs from "../components/FormSampleTypeInputs/FormSampleTypeInputs";

const FormEditSampleTypeDrawer: FC<FormEditSampleTypeDrawerProps> = ({ sampleType, error, isLoading }) => {
    const {
        sampleTypesStore: { lastRequestedQueryKey, cleanupSelectedSampleType },
    } = useSampleTypesStore();

    const { reset } = useFormContext();

    const { isFetching: isSampleTypeFetching } = useQuery<ServerResponse<SampleType>, AxiosError, SampleType>(
        SAMPLE_TYPES_QUERY_KEYS.DETAILS(sampleType.id),
        getSampleTypeDetails(sampleType.id),
        {
            onSuccess: queryData => {
                reset(queryData);
            },
            onError: async () => {
                showErrorToast({ title: "Sample type not found" });
                cleanupSelectedSampleType();
                await queryClient.refetchQueries(lastRequestedQueryKey);
            },
            select: queryData => queryData.data.data,
        }
    );

    const { data: examTemplatesList = [], isFetching: isExamTemplatesListFetching } = useQuery(
        SAMPLE_TYPES_QUERY_KEYS.EXAM_TEMPLATES_BY_ID(sampleType.id),
        getExamTemplatesBySampleTypeId(sampleType.id),
        {
            onError: () => {
                showErrorToast({ title: "Exam templates list error" });
            },
            select: queryData => queryData.data.data,
        }
    );

    return (
        <>
            <FormSampleTypesInputs
                error={error}
                isLoading={isExamTemplatesListFetching || isSampleTypeFetching || isLoading}
            />
            <ExamTemplatesList
                list={examTemplatesList}
                isLoading={isExamTemplatesListFetching || isSampleTypeFetching}
            />
        </>
    );
};

export default observer(FormEditSampleTypeDrawer);
