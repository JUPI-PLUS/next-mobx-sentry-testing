// libs
import React, { useMemo } from "react";
import { useMutation } from "react-query";
import { observer } from "mobx-react";
import { AxiosError } from "axios";

// store
import { useMeasureUnitsStore } from "../../../store";

// components
import FormEditMeasureUnitInputs from "./components/FormEditMeasureUnitInputs/FormEditMeasureUnitInputs";
import { MeasureUnit } from "../../../../../shared/models/business/measureUnits";
import FormDialog from "../../../../../components/uiKit/Dialog/FormDialog";

// helpers
import { patchMeasureUnit } from "../../../../../api/measureUnits";
import { showSuccessToast } from "../../../../../components/uiKit/Toast/helpers";
import { queryClient } from "../../../../../../pages/_app";
import { schema } from "./schema";

// models
import { BaseFormServerValidation, ServerResponse } from "../../../../../shared/models/axios";
import { SubmitEditMeasureUnitData } from "../models";
import { DEFAULT_MEASURE_UNITS_DATA } from "../../../constants";

const EditDialog = () => {
    const {
        measureUnitsStore: { measureUnit, lastRequestedQueryKey, cleanupSelectedMeasureUnit },
    } = useMeasureUnitsStore();

    const { mutateAsync, isLoading, error, isError } = useMutation<
        ServerResponse<MeasureUnit>,
        AxiosError<BaseFormServerValidation>,
        Omit<MeasureUnit, "id">
    >(patchMeasureUnit(measureUnit!.id), {
        async onSuccess({ data }) {
            showSuccessToast({ title: `Measure unit ${data.data.name} has been updated` });
            cleanupSelectedMeasureUnit();
            await queryClient.refetchQueries(lastRequestedQueryKey);
        },
    });

    const onEditSubmit = async (formData: SubmitEditMeasureUnitData) => {
        try {
            await mutateAsync(formData);
        } catch {}
    };

    const defaultValues = useMemo(() => {
        if (measureUnit?.name) return { name: measureUnit.name };

        return DEFAULT_MEASURE_UNITS_DATA;
    }, [measureUnit?.name]);

    return (
        <FormDialog
            title="Edit measure unit"
            childContainerClass="flex"
            isSubmitButtonDisabled={isLoading}
            isCancelButtonDisabled={isLoading}
            defaultValues={defaultValues}
            schema={schema}
            submitText="Edit"
            cancelText="Cancel"
            onClose={cleanupSelectedMeasureUnit}
            onCancel={cleanupSelectedMeasureUnit}
            onSubmit={onEditSubmit}
            isOpen
        >
            <FormEditMeasureUnitInputs isError={isError} errors={error} />
        </FormDialog>
    );
};

export default observer(EditDialog);
