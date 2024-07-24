// libs
import React, { FC, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { useMutation } from "react-query";
import { AxiosError } from "axios";

// components
import DrawerStepper from "../../DrawerStepper/DrawerStepper";
import FindParameterStep from "../components/FindParameterStep/FindParameterStep";
import SubmitParameterStep from "../components/SubmitParamterStep/SubmitParameterStep";

// models
import { DrawerStepProps } from "../../DrawerStepper/models";
import {
    AddParameterStepsEnum,
    AssignOrCreateParameterDrawerProps,
    CreateParameterBody,
    ExistingParameterLookup,
    FindParameterFormData,
    SubmitParameterFormData,
} from "./models";
import { Lookup } from "../../../shared/models/form";
import { BaseFormServerValidation, ServerResponse } from "../../../shared/models/axios";
import { Parameter } from "../../../shared/models/business/parameter";
import { ID } from "../../../shared/models/common";

// store
import { useDrawerStepperStore } from "../../DrawerStepper/store";

// api
import { createParameter, createParameterConditions, editParameter } from "../../../api/parameters";

// helpers
import { showErrorToast, showSuccessToast } from "../../uiKit/Toast/helpers";
import { firstStepSchema, secondStepSchema } from "./schema";
import ParameterConditions from "../components/ParameterConditions/ParameterConditions";
import { object } from "yup";
import { ParameterViewTypeEnum } from "../../../shared/models/business/enums";
import { useParameterConditionsStore } from "../components/ParameterConditions/store";
import isEqual from "lodash/isEqual";
import ConditionsHeaderButton from "../ParameterDrawer/ConditionsHeaderButton/ConditionsHeaderButton";
import { prepareConditionsToSend } from "../components/ParameterConditions/utils";

const AssignOrCreateParameterDrawer: FC<AssignOrCreateParameterDrawerProps> = ({
    onClose,
    onSubmit,
    pickedParamsUUID,
}) => {
    const {
        drawerStepperStore: {
            activeStep,
            goToNextStep,
            setupIsSubmitted,
            goToPrevStep,
            setupDrawerSize,
            setupSubmitButtonText,
            cleanup: cleanupDrawerStepperStore,
        },
    } = useDrawerStepperStore();
    const {
        parameterConditionsStore: {
            conditionGroups,
            cleanup: cleanupParameterConditionsStore,
            validateConditionGroups,
            haveConditionsErrors,
            isConditionsChanged,
        },
    } = useParameterConditionsStore();
    const [selectedParameterUUID, setSelectedParameterUUID] = useState<ExistingParameterLookup | null>(null);
    const [createdParameter, setCreatedParameter] = useState<Parameter | null>(null);
    const [isConditionsStep, setIsConditionsStep] = useState(false);

    const onParameterRequestSuccess = async (parameter: Parameter) => {
        // Save parameter data to compare fields if user tries to go back and click save without any changes
        setCreatedParameter({
            ...parameter,
            notes: parameter.notes || "",
            biological_reference_intervals: parameter.biological_reference_intervals || "",
            options: parameter.options || [],
        });
        // If parameter that was created isnt a number type close drawer and refetch table
        if (parameter.type_view_id !== ParameterViewTypeEnum.NUMBER) {
            await onSubmit(parameter);
            onCloseDrawer();
        }
    };

    const { mutateAsync: createParameterMutation, error: isCreateParameterError } = useMutation<
        ServerResponse<Parameter>,
        AxiosError<BaseFormServerValidation>,
        CreateParameterBody
    >(createParameter, {
        onSuccess: async queryData => {
            const parameter = queryData?.data?.data;
            showSuccessToast({ title: "Parameter has been created" });
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
            showSuccessToast({ title: "Parameter has been updated" });
            await onParameterRequestSuccess(parameter);
        },
    });

    const { mutateAsync: createParameterConditionsMutateAsync } = useMutation(
        createParameterConditions(createdParameter?.uuid ?? ""),
        {
            async onSuccess() {
                showSuccessToast({ title: "Parameter conditions have been created" });
                onSubmit?.(createdParameter as Parameter);
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
        setIsConditionsStep(false);
        onClose();
    };

    const onSubmitFindParameterStep = (formData: FindParameterFormData) => {
        setSelectedParameterUUID(formData.parameterCodeAutocomplete);
        setupIsSubmitted();
        goToNextStep();
    };

    const onNavigateToConditionsStep = () => {
        setIsConditionsStep(true);
        setupDrawerSize("xl");
        setupSubmitButtonText("Save");
    };

    const onSubmitGeneralParameterDataStep = async (formData: SubmitParameterFormData) => {
        const parameterFormData = {
            ...formData,
            si_measurement_units_id: formData.si_measurement_units_id?.value ?? 0,
            type_id: 1, // ??
            type_view_id: formData.type_view_id!.value,
        };

        if (selectedParameterUUID?.uuid) {
            // Submit found parameter
            onSubmit?.({
                ...parameterFormData,
                uuid: selectedParameterUUID.uuid,
                id: selectedParameterUUID.id!,
                options: parameterFormData.options?.map(({ id, label }) => ({ id, name: label })) ?? null,
            });
            return;
        }

        const requestBody = {
            ...parameterFormData,
            options: parameterFormData.options?.length ? parameterFormData.options.map(({ id }) => id) : [],
        };
        const isParameterHasTypeNumber = requestBody.type_view_id === ParameterViewTypeEnum.NUMBER;

        if (isParameterHasTypeNumber) {
            onNavigateToConditionsStep();
            goToNextStep();
        }

        if (createdParameter) {
            if (isEqual(requestBody, createdParameter)) {
                return;
            }

            try {
                await editParameterMutation(requestBody);
            } catch (e) {}
            return;
        }

        // Create new one parameter
        await createParameterMutation(requestBody);
    };

    const onSubmitParameterConditions = async () => {
        // Conditions step
        validateConditionGroups();
        if (haveConditionsErrors()) {
            showErrorToast({
                title: "Cannot save parameter conditions",
                message: "There are errors in condition rules",
            });
            return;
        }

        await createParameterConditionsMutateAsync(prepareConditionsToSend(conditionGroups));
    };

    const onDrawerSubmit = async (formData: FindParameterFormData | SubmitParameterFormData) => {
        if (activeStep === AddParameterStepsEnum.FIND_PARAMETER) {
            onSubmitFindParameterStep(formData as FindParameterFormData);
            return;
        }

        if (activeStep === AddParameterStepsEnum.SUBMIT_PARAMETER_GENERAL_DATA) {
            await onSubmitGeneralParameterDataStep(formData as SubmitParameterFormData);
            return;
        }

        await onSubmitParameterConditions();
    };

    const steps: DrawerStepProps<Record<string, string | boolean | Lookup<ID>>>[] = useMemo(
        () => [
            {
                schema: firstStepSchema,
                saveText: "Continue",
                defaultValues: {
                    parameterCodeAutocomplete: selectedParameterUUID ?? "",
                },
                backText: "",
            },
            {
                schema: secondStepSchema,
                saveText: "Save",
                defaultValues: {
                    code: selectedParameterUUID?.label ?? "",
                    name: "",
                    si_measurement_units_id: undefined,
                    type_view_id: undefined,
                    biological_reference_intervals: "",
                    notes: "",
                    is_printable: true,
                    is_required: true,
                },
                backText: "Back",
            },
            {
                schema: object().shape({}),
                saveText: "Save",
                defaultValues: {},
                backText: "Back",
            },
        ],
        [selectedParameterUUID]
    );

    const onBack = () => {
        if (isConditionsStep) {
            setIsConditionsStep(false);
            setupDrawerSize("lg");
            setupSubmitButtonText("Save");
        }
        goToPrevStep();
    };

    useEffect(() => {
        isConditionsChanged && setupIsSubmitted();
    }, [isConditionsChanged]);

    return (
        <DrawerStepper
            onSubmit={onDrawerSubmit}
            isOpen
            onClose={onClose}
            onCancel={onClose}
            onOptional={onBack}
            steps={steps}
            size="lg"
            side="right"
            title="Add parameter"
            containerClass={`w-full ${isConditionsStep ? "min-w-3xl" : ""}`}
            headerButton={isConditionsStep ? <ConditionsHeaderButton /> : null}
            couldCloseOnBackdrop={!isConditionsStep}
        >
            <FindParameterStep pickedParamsUUID={pickedParamsUUID} />
            <SubmitParameterStep
                error={isCreateParameterError || isEditParameterError}
                uuid={selectedParameterUUID?.uuid || createdParameter?.uuid}
                isDisabled={Boolean(selectedParameterUUID?.uuid)}
            />
            <ParameterConditions
                parameterUUID={selectedParameterUUID?.uuid}
                parameterName={selectedParameterUUID?.label || ""}
            />
        </DrawerStepper>
    );
};

export default observer(AssignOrCreateParameterDrawer);
