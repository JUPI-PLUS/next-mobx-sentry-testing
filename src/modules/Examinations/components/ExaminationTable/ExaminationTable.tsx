// libs
import React, { useCallback, useEffect, useMemo } from "react";
import { observer } from "mobx-react";
import { useFormContext } from "react-hook-form";
import { useMutation, useQuery } from "react-query";

// stores
import { useExaminationStore } from "../../store";

// api
import { examinationValidate, getExaminationListBySample } from "../../../../api/samples";

// helpers
import { queryClient } from "../../../../../pages/_app";
import { getFormContainerDefaultValuesProps, prepareExaminationsResultToValidate } from "../../utils";

// constants
import { SAMPLES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

// components
import TableHeader from "./components/TableHeader/TableHeader";
import { ExaminationsSkeleton } from "../Skeletons";
import { showErrorToast, showSuccessToast } from "../../../../components/uiKit/Toast/helpers";
import TableSummary from "./components/TableSummary/TableSummary";
import OrderList from "./components/OrderList/OrderList";

const ExaminationTable = () => {
    const {
        examinationStore: {
            activeSample,
            examinationTableData,
            initialExaminationTableData,
            lastRequestedQueryKey,
            setupExaminationResults,
            setupFilteredExaminationResults,
            examTemplatesByWorkplaceLookup,
        },
    } = useExaminationStore();
    const { reset } = useFormContext();

    const { isFetching } = useQuery(
        SAMPLES_QUERY_KEYS.EXAMINATIONS_BY_SAMPLE(activeSample?.uuid ?? ""),
        getExaminationListBySample(activeSample?.uuid ?? ""),
        {
            enabled: Boolean(activeSample?.uuid),
            select: queryData => queryData.data.data,
            onSuccess: data => {
                const orders = setupExaminationResults(
                    data,
                    SAMPLES_QUERY_KEYS.EXAMINATIONS_BY_SAMPLE(activeSample?.uuid ?? "")
                );
                reset(getFormContainerDefaultValuesProps(orders));
            },
        }
    );

    const { mutateAsync: mutateExaminationValidate, isLoading: isValidateMutationLoading } = useMutation(
        examinationValidate,
        {
            async onSuccess() {
                if (lastRequestedQueryKey) {
                    await queryClient.refetchQueries(lastRequestedQueryKey);
                }
                showSuccessToast({ title: "Results have been validated" });
            },
        }
    );

    const onClickValidateHandler = useCallback(async () => {
        const exams = prepareExaminationsResultToValidate(examinationTableData, activeSample!.uuid);
        if (exams.orders.length) {
            await mutateExaminationValidate(exams);
        } else {
            showErrorToast({ message: "Nothing to save" });
        }
    }, [activeSample, examinationTableData, mutateExaminationValidate]);

    useEffect(() => {
        const orders = setupFilteredExaminationResults(initialExaminationTableData);
        reset(getFormContainerDefaultValuesProps(orders));
    }, [examTemplatesByWorkplaceLookup]);

    const tableClassName = useMemo(
        () =>
            examinationTableData.length
                ? "row-start-1 col-start-1 row-end-auto col-end-auto auto-rows-min overflow-y-scroll"
                : "grid-rows-autoFr overflow-hidden",

        [examinationTableData.length]
    );

    if (isFetching) return <ExaminationsSkeleton />;

    return (
        <div className="w-full h-full grid grid-rows-frAuto overflow-hidden">
            <div className="overflow-hidden pl-6 pr-3 pt-6">
                <div className={`w-full h-full grid ${tableClassName}`}>
                    <TableHeader />
                    <OrderList orders={examinationTableData} />
                </div>
            </div>
            <TableSummary isValidateMutationLoading={isValidateMutationLoading} onValidate={onClickValidateHandler} />
        </div>
    );
};

export default observer(ExaminationTable);
