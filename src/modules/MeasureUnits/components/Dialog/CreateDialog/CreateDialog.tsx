// libs
import React from "react";
import { useMutation } from "react-query";
import { observer } from "mobx-react";
import { AxiosError } from "axios";

// store
import { useMeasureUnitsStore } from "../../../store";

// components
import FormCreateMeasureUnitInputs from "./components/FormCreateMeasureUnitInputs/FormCreateMeasureUnitInputs";
import { MeasureUnit } from "../../../../../shared/models/business/measureUnits";
import FormDialog from "../../../../../components/uiKit/Dialog/FormDialog";

// helpers
import { createMeasureUnit } from "../../../../../api/measureUnits";
import { showSuccessToast } from "../../../../../components/uiKit/Toast/helpers";
import { queryClient } from "../../../../../../pages/_app";
import { schema } from "./schema";

// models
import { BaseFormServerValidation, ServerResponse } from "../../../../../shared/models/axios";
import { SubmitCreateMeasureUnitData } from "../models";

// constants
import { DEFAULT_MEASURE_UNITS_DATA } from "../../../constants";

const CreateDialog = () => {
    const {
        measureUnitsStore: { lastRequestedQueryKey, cleanupSelectedMeasureUnit },
    } = useMeasureUnitsStore();

    const { mutateAsync, isLoading, error, isError } = useMutation<
        ServerResponse<MeasureUnit>,
        AxiosError<BaseFormServerValidation>,
        Omit<MeasureUnit, "id">
    >(createMeasureUnit, {
        async onSuccess({ data }) {
            showSuccessToast({ title: `Measure unit ${data.data.name} has been created` });
            cleanupSelectedMeasureUnit();
            await queryClient.refetchQueries(lastRequestedQueryKey);
        },
    });

    const onCreateSubmit = async (formData: SubmitCreateMeasureUnitData) => {
        try {
            await mutateAsync(formData);
        } catch {}
    };

    return (
        <FormDialog
            title="Create measure unit"
            childContainerClass="flex"
            isSubmitButtonDisabled={isLoading}
            isCancelButtonDisabled={isLoading}
            defaultValues={DEFAULT_MEASURE_UNITS_DATA}
            schema={schema}
            submitText="Create"
            cancelText="Cancel"
            onClose={cleanupSelectedMeasureUnit}
            onCancel={cleanupSelectedMeasureUnit}
            onSubmit={onCreateSubmit}
            isOpen
        >
            <FormCreateMeasureUnitInputs isError={isError} errors={error} />
        </FormDialog>
    );
};

export default observer(CreateDialog);
