// libs
import React, { FC, useState } from "react";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import isEqual from "lodash/isEqual";
import { observer } from "mobx-react";

// stores
import { useParameterConditionsStore } from "../../../../../../../../components/ParameterDrawers/components/ParameterConditions/store";
import { useExamTemplateStore } from "../../../../../../store";
import { useDrawerStepperStore } from "../../../../../../../../components/DrawerStepper/store";

// helpers
import { createParameterConditions, editParameter } from "../../../../../../../../api/parameters";
import { showErrorToast, showSuccessToast } from "../../../../../../../../components/uiKit/Toast/helpers";

// models
import { EditParameterDrawerProps } from "./models";
import { Parameter } from "../../../../../../../../shared/models/business/parameter";
import {
    CreateParameterBody,
    SubmitParameterFormData,
} from "../../../../../../../../components/ParameterDrawers/AssingOrCreateParameter/models";
import { BaseFormServerValidation, ServerResponse } from "../../../../../../../../shared/models/axios";
import { ParameterViewTypeEnum } from "../../../../../../../../shared/models/business/enums";
import { CreateParameterDrawerStepsEnum } from "../../../../../../../../components/ParameterDrawers/ParameterDrawer/models";
import { ServerParameterConditionGroups } from "../../../../../../../../components/ParameterDrawers/components/ParameterConditions/models";

// components
import ParameterDrawer from "../../../../../../../../components/ParameterDrawers/ParameterDrawer/ParameterDrawer";

const EditParameterDrawer: FC<EditParameterDrawerProps> = ({ isOpen, onClose, onEditParameter, paramUUID }) => {
    const {
        parameterConditionsStore: { cleanup: cleanupParameterConditionsStore },
    } = useParameterConditionsStore();
    const {
        examTemplateStore: { selectedItem, clearActionType },
    } = useExamTemplateStore();
    const {
        drawerStepperStore: { cleanup: cleanupDrawerStepperStore },
    } = useDrawerStepperStore();

    const [updatedParameter, setUpdatedParameter] = useState<Parameter | null>({
        ...selectedItem.item!,
        options: selectedItem.item?.options ?? [],
        notes: selectedItem.item?.notes || "",
        biological_reference_intervals: selectedItem.item?.biological_reference_intervals ?? "",
    });

    const { mutateAsync: editParameterMutateAsync, error } = useMutation<
        ServerResponse<Parameter>,
        AxiosError<BaseFormServerValidation>,
        CreateParameterBody
    >(editParameter(paramUUID as string), {
        onSuccess: queryData => {
            const parameter = queryData.data.data;

            setUpdatedParameter({
                ...parameter,
                options: parameter.options || [],
                notes: parameter.notes || "",
                biological_reference_intervals: parameter.biological_reference_intervals || "",
            });
            onEditParameter(parameter);

            if (parameter.type_view_id !== ParameterViewTypeEnum.NUMBER) {
                onCloseDrawer();
            }

            showSuccessToast({ title: `Parameter ${parameter.name} has been updated` });
        },
    });

    const { mutateAsync: createParameterConditionsMutateAsync } = useMutation(
        createParameterConditions(paramUUID as string),
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

    const onCloseDrawer = () => {
        cleanupParameterConditionsStore();
        cleanupDrawerStepperStore();
        setUpdatedParameter(null);
        clearActionType();
        onClose();
    };

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

    const onSubmit = async (
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

    return (
        <ParameterDrawer
            isOpen={isOpen}
            onClose={onCloseDrawer}
            onSubmit={onSubmit}
            uuid={paramUUID}
            isEdit
            error={error}
            title="Edit parameter"
        />
    );
};
export default observer(EditParameterDrawer);
