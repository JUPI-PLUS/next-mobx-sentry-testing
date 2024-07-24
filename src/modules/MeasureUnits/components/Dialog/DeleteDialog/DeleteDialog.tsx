// libs
import React from "react";
import { useMutation, useQuery } from "react-query";
import { observer } from "mobx-react";
import { AxiosError } from "axios";

// store
import { useMeasureUnitsStore } from "../../../store";

// constants
import { MEASURE_UNITS_QUERY_KEYS } from "../../../../../shared/constants/queryKeys";

// components
import Dialog from "../../../../../components/uiKit/Dialog/Dialog";
import DeleteDialogContent from "./components/DeleteDialogContent";

// helpers
import {
    deleteMeasureUnit,
    getExamTemplatesByMeasureUnitId,
    getMeasureUnitDetails,
    getParamsByMeasureUnitId,
} from "../../../../../api/measureUnits";
import { showErrorToast, showSuccessToast } from "../../../../../components/uiKit/Toast/helpers";
import { queryClient } from "../../../../../../pages/_app";

// models
import { BaseFormServerValidation, ServerResponse } from "../../../../../shared/models/axios";

const DeleteDialog = () => {
    const {
        measureUnitsStore: { measureUnit, lastRequestedQueryKey, cleanupSelectedMeasureUnit },
    } = useMeasureUnitsStore();

    const { mutateAsync, isLoading } = useMutation<ServerResponse, AxiosError<BaseFormServerValidation>, number>(
        deleteMeasureUnit,
        {
            onSuccess() {
                showSuccessToast({ title: `Measure unit ${measureUnit!.name} has been deleted` });
            },
            onError() {
                showErrorToast({ title: `Measure unit ${measureUnit!.name} has been already deleted` });
            },
            async onSettled() {
                await queryClient.refetchQueries(lastRequestedQueryKey);
            },
        }
    );

    const { isFetching: isMeasureUnitFetching } = useQuery(
        MEASURE_UNITS_QUERY_KEYS.DETAILS(measureUnit!.id),
        getMeasureUnitDetails(measureUnit!.id),
        {
            onError: async () => {
                showErrorToast({ title: `Measure unit ${measureUnit!.name} not found` });
                cleanupSelectedMeasureUnit();
                await queryClient.refetchQueries(lastRequestedQueryKey);
            },
            refetchOnWindowFocus: true,
        }
    );

    const { data: examTemplatesList = [], isFetching: isExamTemplatesListFetching } = useQuery(
        MEASURE_UNITS_QUERY_KEYS.EXAM_TEMPLATES_BY_ID(measureUnit!.id),
        getExamTemplatesByMeasureUnitId(measureUnit!.id),
        {
            select: queryData => queryData.data.data,
            refetchOnWindowFocus: true,
        }
    );

    const { data: paramsList = [], isFetching: isParamsListFetching } = useQuery(
        MEASURE_UNITS_QUERY_KEYS.PARAMS_BY_ID(measureUnit!.id),
        getParamsByMeasureUnitId(measureUnit!.id),
        {
            select: queryData => queryData.data.data,
            refetchOnWindowFocus: true,
        }
    );

    const isDeleteAvailable = paramsList.length === 0 && examTemplatesList.length === 0;

    const onDeleteSubmit = async () => {
        if (isDeleteAvailable) {
            try {
                await mutateAsync(measureUnit!.id);
            } catch {}
        }
        cleanupSelectedMeasureUnit();
    };

    const isInformationLoading = isMeasureUnitFetching || isExamTemplatesListFetching || isParamsListFetching;

    return (
        <Dialog
            title="Delete measure unit"
            isOpen
            containerClass="max-w-lg max-h-5/6"
            childContainerClass="flex"
            isSubmitButtonDisabled={isLoading || isInformationLoading}
            isCancelButtonDisabled={isLoading || isInformationLoading}
            submitText={isDeleteAvailable ? "Delete" : "OK"}
            cancelText={isDeleteAvailable ? "Cancel" : undefined}
            onClose={cleanupSelectedMeasureUnit}
            onCancel={cleanupSelectedMeasureUnit}
            onSubmit={onDeleteSubmit}
        >
            <DeleteDialogContent
                isDeleteAvailable={isDeleteAvailable}
                examTemplatesList={examTemplatesList}
                paramsList={paramsList}
                isLoading={isInformationLoading}
                measureUnitName={measureUnit!.name}
            />
        </Dialog>
    );
};

export default observer(DeleteDialog);
