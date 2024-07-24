// libs
import React, { useState } from "react";
import { observer } from "mobx-react";
import { AxiosError } from "axios";
import { useMutation } from "react-query";
import isEqual from "lodash/isEqual";

// stores
import { useParametersStore } from "../../store";
import { useParameterConditionsStore } from "../../../../components/ParameterDrawers/components/ParameterConditions/store";
import { useDrawerStepperStore } from "../../../../components/DrawerStepper/store";

// api
import { createParameter, createParameterConditions, editParameter } from "../../../../api/parameters";

// helpers
import { schema } from "./schema";
import { showErrorToast, showSuccessToast } from "../../../../components/uiKit/Toast/helpers";
import { queryClient } from "../../../../../pages/_app";
import { useDisclosure } from "../../../../shared/hooks/useDisclosure";

// models
import {
    CreateParameterBody,
    SubmitParameterFormData,
} from "../../../../components/ParameterDrawers/AssingOrCreateParameter/models";
import { BaseFormServerValidation, ServerResponse } from "../../../../shared/models/axios";
import { Parameter } from "../../../../shared/models/business/parameter";
import { ServerParameterConditionGroups } from "../../../../components/ParameterDrawers/components/ParameterConditions/models";
import { ParameterViewTypeEnum } from "../../../../shared/models/business/enums";
import { CreateParameterDrawerStepsEnum } from "../../../../components/ParameterDrawers/ParameterDrawer/models";
import { ActionTypeEnum } from "../../models";

// components
import Filters from "./components/Filters/Filters";
import FormContainer from "../../../../components/uiKit/forms/FormContainer/FormContainer";
import { SolidButton } from "../../../../components/uiKit/Button/Button";
import ParameterDrawer from "../../../../components/ParameterDrawers/ParameterDrawer/ParameterDrawer";
import FilterFormValuesUpdater from "../../../../components/FilterFormValuesUpdater/FilterFormValuesUpdater";

const Header = () => {
    const {
        parametersStore: { parameterFilters, lastRequestedQueryKey },
    } = useParametersStore();
    const {
        parameterConditionsStore: { cleanup: cleanupParameterConditionsStore },
    } = useParameterConditionsStore();
    const {
        drawerStepperStore: { cleanup: cleanupDrawerStepperStore },
    } = useDrawerStepperStore();
    const [createdParameter, setCreatedParameter] = useState<Parameter | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const onParameterRequestSuccess = async (parameter: Parameter) => {
        // Save parameter data to compare fields if user tries to go back and click save without any changes
        setCreatedParameter({
            ...parameter,
            notes: parameter.notes || "",
            biological_reference_intervals: parameter.biological_reference_intervals || "",
            options: parameter.options || [],
        });
        // If parameter that was created isn't a number type close drawer and refetch table
        if (parameter.type_view_id !== ParameterViewTypeEnum.NUMBER) {
            await queryClient.refetchQueries(lastRequestedQueryKey);
            onCloseDrawer();
        }
    };

    const { mutateAsync: createParameterMutation, error: isCreateParameterError } = useMutation<
        ServerResponse<Parameter>,
        AxiosError<BaseFormServerValidation>,
        CreateParameterBody
    >(createParameter, {
        async onSuccess(queryData) {
            const parameter = queryData.data.data;
            showSuccessToast({ title: `Parameter ${parameter.name} has been created` });
            await onParameterRequestSuccess(parameter);
        },
    });

    const { mutateAsync: editParameterMutation, error: isEditParameterError } = useMutation<
        ServerResponse<Parameter>,
        AxiosError<BaseFormServerValidation>,
        CreateParameterBody
    >(editParameter(createdParameter?.uuid ?? ""), {
        async onSuccess(queryData) {
            const parameter = queryData.data.data;
            showSuccessToast({ title: `Parameter ${parameter.name} has been updated` });
            await onParameterRequestSuccess(parameter);
        },
    });

    const { mutateAsync: createParameterConditionsMutateAsync } = useMutation(
        createParameterConditions(createdParameter?.uuid ?? ""),
        {
            async onSuccess() {
                showSuccessToast({ title: "Parameter conditions have been created" });
                onCloseDrawer();
            },
            onError() {
                showErrorToast({ title: "Couldn't create parameter conditions" });
            },
        }
    );

    const onCloseDrawer = () => {
        cleanupParameterConditionsStore();
        cleanupDrawerStepperStore();
        setCreatedParameter(null);
        onClose();
    };

    const onSubmit = () => {};

    const submitCreateGeneralParameterData = async (formData: SubmitParameterFormData, actionType: ActionTypeEnum) => {
        const requestBody = {
            ...formData,
            si_measurement_units_id: formData.si_measurement_units_id?.value ?? 0,
            options: formData.options?.map(({ id }) => id) ?? null,
            type_id: 1, // ??
            type_view_id: formData.type_view_id!.value,
        };

        if (createdParameter) {
            const { id, uuid, ...createdParameterDataToCompare } = createdParameter;
            if (isEqual(requestBody, createdParameterDataToCompare)) {
                return;
            }
        }

        if (actionType === ActionTypeEnum.CREATE) {
            await createParameterMutation(requestBody);
            return;
        }

        await editParameterMutation(requestBody);
    };

    const submitParameterConditions = async (formData: ServerParameterConditionGroups[]) => {
        await createParameterConditionsMutateAsync(formData);
    };

    const onParameterSubmit = async (
        formData: SubmitParameterFormData | ServerParameterConditionGroups[],
        step: CreateParameterDrawerStepsEnum
    ) => {
        if (step === CreateParameterDrawerStepsEnum.GENERAL_INFO) {
            await submitCreateGeneralParameterData(
                formData as SubmitParameterFormData,
                createdParameter ? ActionTypeEnum.EDIT : ActionTypeEnum.CREATE
            );
            return;
        }

        await submitParameterConditions(formData as ServerParameterConditionGroups[]);
    };

    const filtersDefaultValues = { searchCode: parameterFilters.code };

    return (
        <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold whitespace-nowrap">Constructor / Parameters</h2>
            <div className="w-full flex items-center justify-end">
                <FormContainer
                    shouldShowConfirmationDialog={false}
                    onSubmit={onSubmit}
                    defaultValues={filtersDefaultValues}
                    schema={schema}
                    autoComplete="off"
                    className="w-full mr-8"
                >
                    <FilterFormValuesUpdater defaultValues={filtersDefaultValues}>
                        <Filters />
                    </FilterFormValuesUpdater>
                </FormContainer>
                <SolidButton
                    data-testid="create-parameter-button"
                    variant="primary"
                    text="Create parameter"
                    type="button"
                    size="sm"
                    onClick={onOpen}
                    className="whitespace-nowrap"
                />
                <ParameterDrawer
                    onSubmit={onParameterSubmit}
                    error={isCreateParameterError || isEditParameterError}
                    isOpen={isOpen}
                    onClose={onCloseDrawer}
                />
            </div>
        </div>
    );
};

export default observer(Header);
