// libs
import React, { FC, useCallback, useMemo } from "react";
import { stringify } from "query-string";
import { object } from "yup";
import { observer } from "mobx-react";
import { useMutation, useQuery } from "react-query";

// stores
import { useExaminationStore } from "../../store";

// api
import { examinationSave, examinationsListOfSamples } from "../../../../api/samples";

// helpers
import { deepTrim } from "../../../../shared/utils/string";

import { getFormContainerSchemaProps, prepareExaminationsResultToSave } from "../../utils";
import { queryClient } from "../../../../../pages/_app";

// models
import { ExaminationBySample } from "../../models";

// constants
import { SAMPLES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

// components
import { showSuccessToast } from "../../../../components/uiKit/Toast/helpers";
import SampleDetails from "../ExaminationTable/components/SampleDetails/SampleDetails";
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import { ExaminationsContainerSkeleton } from "../Skeletons";

const ExaminationResultsContainer: FC<{ children: JSX.Element }> = ({ children }) => {
    const {
        examinationStore: {
            activeSample,
            examinationTableData,
            lastRequestedQueryKey,
            setupExaminationsCanBeValidated,
            setActiveSample,
        },
    } = useExaminationStore();

    const schema = useMemo(() => getFormContainerSchemaProps(examinationTableData), [examinationTableData]);

    const { mutateAsync: mutateExaminationSave } = useMutation(examinationSave, {
        async onSuccess() {
            await queryClient.refetchQueries([
                SAMPLES_QUERY_KEYS.FILTER_SAMPLES_LIST(stringify({ barcode: activeSample?.barcode })),
                activeSample?.barcode,
            ]);
            if (lastRequestedQueryKey) {
                await queryClient.refetchQueries(lastRequestedQueryKey);
            }
            setupExaminationsCanBeValidated(false);
            showSuccessToast({ title: "Results have been saved" });
        },
    });

    const onClickSaveHandler = useCallback(async () => {
        await mutateExaminationSave({
            sample_uuid: activeSample!.uuid,
            orders: deepTrim(prepareExaminationsResultToSave(examinationTableData)) as ExaminationBySample[],
        });
    }, [mutateExaminationSave, activeSample, examinationTableData]);

    const { isFetching: isActiveSampleFetching } = useQuery(
        [SAMPLES_QUERY_KEYS.FILTER_SAMPLES_LIST(stringify({ barcode: activeSample?.barcode })), activeSample?.barcode],
        examinationsListOfSamples(stringify({ barcode: activeSample?.barcode })),
        {
            onSuccess: queryData => {
                const updatedActiveSample = queryData.data.data.find(({ uuid }) => activeSample?.uuid === uuid);
                if (updatedActiveSample) {
                    setActiveSample(updatedActiveSample);
                }
            },
            enabled: Boolean(activeSample?.barcode),
        }
    );

    if (isActiveSampleFetching) return <ExaminationsContainerSkeleton />;

    return (
        <div className="flex flex-col w-full h-full bg-white rounded-md shadow-card-shadow">
            <SampleDetails />
            <FormContainer
                onSubmit={onClickSaveHandler}
                schema={object().shape(schema)}
                defaultValues={{}}
                className="h-full max-h-full overflow-y-hidden"
            >
                {children}
            </FormContainer>
        </div>
    );
};

export default observer(ExaminationResultsContainer);
