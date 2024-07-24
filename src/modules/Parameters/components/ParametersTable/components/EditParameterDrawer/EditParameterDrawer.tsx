import React, { useMemo, useState } from "react";
import { observer } from "mobx-react";
import ParameterDrawer from "../../../../../../components/ParameterDrawers/ParameterDrawer/ParameterDrawer";
import {
    CreateParameterBody,
    SubmitParameterFormData,
} from "../../../../../../components/ParameterDrawers/AssingOrCreateParameter/models";
import { useParametersStore } from "../../../../store";
import { useMutation } from "react-query";
import { createParameterConditions, editParameter } from "../../../../../../api/parameters";
import { queryClient } from "../../../../../../../pages/_app";
import { showErrorToast, showSuccessToast } from "../../../../../../components/uiKit/Toast/helpers";
import { getLookupItem } from "../../../../../../shared/utils/lookups";
import { ParameterViewTypeEnum } from "../../../../../../shared/models/business/enums";
import { CreateParameterDrawerStepsEnum } from "../../../../../../components/ParameterDrawers/ParameterDrawer/models";
import { ServerParameterConditionGroups } from "../../../../../../components/ParameterDrawers/components/ParameterConditions/models";
import { useParameterConditionsStore } from "../../../../../../components/ParameterDrawers/components/ParameterConditions/store";
import { BaseFormServerValidation, ServerResponse } from "../../../../../../shared/models/axios";
import { Parameter } from "../../../../../../shared/models/business/parameter";
import { AxiosError } from "axios";
import isEqual from "lodash/isEqual";
import { useDrawerStepperStore } from "../../../../../../components/DrawerStepper/store";

const EditParameterDrawer = () => {
    const {
        parametersStore: {
            selectedParameter,
            measurementUnitsLookup,
            parameterTypesLookup,
            lastRequestedQueryKey,
            setupParameterAction,
            setupSelectedParameter,
        },
    } = useParametersStore();
    const {
        parameterConditionsStore: { cleanup: cleanupParameterConditionsStore },
    } = useParameterConditionsStore();
    const {
        drawerStepperStore: { cleanup: cleanupDrawerStepperStore },
    } = useDrawerStepperStore();

    const [updatedParameter, setUpdatedParameter] = useState<Parameter | null>(() => ({
        id: selectedParameter!.id,
        uuid: selectedParameter!.uuid,
        si_measurement_units_id: selectedParameter!.si_measurement_units_id,
        name: selectedParameter!.name,
        code: selectedParameter!.code,
        type_view_id: selectedParameter!.type_view_id,
        notes: selectedParameter?.notes || "",
        type_id: selectedParameter!.type_id,
        is_required: selectedParameter!.is_required,
        is_printable: selectedParameter!.is_printable,
        options: selectedParameter?.options ?? [],
        biological_reference_intervals: selectedParameter?.biological_reference_intervals ?? "",
    }));

    const onCloseDrawer = () => {
        cleanupParameterConditionsStore();
        cleanupDrawerStepperStore();
        setupParameterAction(null);
        setupSelectedParameter(null);
    };

    const { mutateAsync: editParameterMutateAsync, error } = useMutation<
        ServerResponse<Parameter>,
        AxiosError<BaseFormServerValidation>,
        CreateParameterBody
    >(editParameter(selectedParameter!.uuid), {
        async onSuccess(queryData) {
            const parameter = queryData.data.data;

            setUpdatedParameter({
                ...parameter,
                options: parameter.options || [],
                notes: parameter.notes || "",
                biological_reference_intervals: parameter.biological_reference_intervals || "",
            });
            await queryClient.refetchQueries(lastRequestedQueryKey);

            if (parameter.type_view_id !== ParameterViewTypeEnum.NUMBER) {
                onCloseDrawer();
            }

            showSuccessToast({ title: `Parameter ${parameter.name} has been updated` });
        },
    });

    const { mutateAsync: createParameterConditionsMutateAsync } = useMutation(
        createParameterConditions(selectedParameter!.uuid),
        {
            async onSuccess() {
                showSuccessToast({ title: "Parameter conditions have been updated" });
                onCloseDrawer();
            },
            onError() {
                showErrorToast({ title: "Couldn't update parameter conditions" });
            },
        }
    );

    const submitGeneralParameterData = async (formData: SubmitParameterFormData) => {
        const requestBody = {
            ...formData,
            type_id: 1, // ??
            si_measurement_units_id: formData.si_measurement_units_id!.value,
            options: formData.options?.map(({ value }) => value) ?? null,
            type_view_id: formData.type_view_id!.value,
        };
        if (updatedParameter && isEqual(requestBody, updatedParameter)) {
            if (requestBody.type_view_id !== ParameterViewTypeEnum.NUMBER) {
                onCloseDrawer();
            }
            return;
        }

        await editParameterMutateAsync(requestBody);
    };

    const submitParameterConditions = async (formData: ServerParameterConditionGroups[]) => {
        await createParameterConditionsMutateAsync(formData);
    };

    const onParameterSubmit = async (
        formData: SubmitParameterFormData | ServerParameterConditionGroups[],
        step: CreateParameterDrawerStepsEnum
    ) => {
        if (step === CreateParameterDrawerStepsEnum.GENERAL_INFO) {
            await submitGeneralParameterData(formData as SubmitParameterFormData);
            return;
        }

        try {
            await submitParameterConditions(formData as ServerParameterConditionGroups[]);
        } catch (e) {}
    };

    const defaultValues = useMemo<SubmitParameterFormData>(
        () => ({
            name: selectedParameter!.name,
            code: selectedParameter!.code,
            options: selectedParameter!.options?.map(({ id, name }) => ({ id, value: id, label: name })) ?? null,
            biological_reference_intervals: selectedParameter!.biological_reference_intervals ?? "",
            is_printable: selectedParameter!.is_printable,
            is_required: selectedParameter!.is_required,
            si_measurement_units_id: getLookupItem(measurementUnitsLookup, selectedParameter!.si_measurement_units_id),
            notes: selectedParameter!.notes ?? "",
            type_view_id: getLookupItem(parameterTypesLookup, selectedParameter!.type_view_id),
        }),
        [measurementUnitsLookup, parameterTypesLookup, selectedParameter]
    );

    return (
        <ParameterDrawer
            error={error}
            defaultValues={defaultValues}
            isOpen
            onClose={onCloseDrawer}
            onSubmit={onParameterSubmit}
            isEdit
            title="Edit parameter"
            uuid={selectedParameter!.uuid}
        />
    );
};

export default observer(EditParameterDrawer);
