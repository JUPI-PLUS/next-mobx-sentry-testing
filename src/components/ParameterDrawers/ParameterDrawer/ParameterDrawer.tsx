// libs
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";
import { observer } from "mobx-react";
import { object } from "yup";

// components
import ParameterConditions from "../components/ParameterConditions/ParameterConditions";
import SubmitParameterStep from "../components/SubmitParamterStep/SubmitParameterStep";
import DrawerStepper from "../../DrawerStepper/DrawerStepper";
import { useParameterConditionsStore } from "../components/ParameterConditions/store";
import ConditionsHeaderButton from "./ConditionsHeaderButton/ConditionsHeaderButton";

// stores
import { useDrawerStepperStore } from "../../DrawerStepper/store";

// models
import { CreateParameterDrawerStepsEnum, ParameterDrawerProps } from "./models";
import { SubmitParameterFormData } from "../AssingOrCreateParameter/models";
import { DrawerStepProps } from "../../DrawerStepper/models";
import { ParameterViewTypeEnum } from "../../../shared/models/business/enums";

// schema
import { schema } from "./schema";

// helpers
import { showErrorToast } from "../../uiKit/Toast/helpers";
import { prepareConditionsToSend } from "../components/ParameterConditions/utils";

const defaultFormValues: SubmitParameterFormData = {
    code: "",
    name: "",
    si_measurement_units_id: null,
    type_view_id: null,
    biological_reference_intervals: "",
    notes: "",
    is_printable: true,
    is_required: true,
    options: null,
};

const ParameterDrawer: FC<ParameterDrawerProps> = ({
    defaultValues = defaultFormValues,
    onSubmit,
    isOpen,
    onClose,
    error,
    title = "Add parameter",
    uuid,
    isEdit = false,
}) => {
    const [isConditionsStep, setIsConditionsStep] = useState(false);
    const [prevFormValues, setPrevFormValues] = useState<SubmitParameterFormData | null>(defaultValues);
    const [parameterName, setParameterName] = useState<string | null>(null);
    const {
        drawerStepperStore: {
            activeStep,
            setupDrawerSize,
            goToNextStep,
            cleanup,
            goToPrevStep,
            setupSubmitButtonText,
            setupIsSubmitted,
        },
    } = useDrawerStepperStore();
    const {
        parameterConditionsStore: {
            conditionGroups,
            validateConditionGroups,
            haveConditionsErrors,
            isConditionsChanged,
        },
    } = useParameterConditionsStore();

    const steps: DrawerStepProps<Record<string, string> | SubmitParameterFormData>[] = useMemo(
        () => [
            {
                schema: schema,
                saveText: "Continue",
                defaultValues: prevFormValues || defaultValues,
                backText: "",
            },
            {
                schema: object().shape({}),
                saveText: "Save",
                defaultValues: {},
                backText: "Back",
            },
        ],
        [isEdit, prevFormValues, schema, defaultValues]
    );

    const [isSubmitButtonDisabled, setIsSubmitButtonDisabled] = useState(true);

    const onLookupsFetchComplete = useCallback((isFetching: boolean) => {
        setIsSubmitButtonDisabled(isFetching);
    }, []);

    const onSubmitGeneralParameterData = async (formData: SubmitParameterFormData) => {
        try {
            await onSubmit(formData, CreateParameterDrawerStepsEnum.GENERAL_INFO, formData.type_view_id?.value);
            if (formData.type_view_id?.value === ParameterViewTypeEnum.NUMBER) {
                setIsConditionsStep(true);
                setPrevFormValues(formData);
                setupDrawerSize("xl");
                setupSubmitButtonText("Save");
                setParameterName(formData!.name);
                goToNextStep();
            }
        } catch (e) {}
    };

    useEffect(() => {
        if (!isOpen) {
            onCloseDrawer();
        }
    }, [isOpen]);

    const onSubmitConditions = async () => {
        // Conditions step
        validateConditionGroups();
        if (haveConditionsErrors()) {
            showErrorToast({
                title: "Cannot save parameter conditions",
                message: "There are errors in condition rules",
            });
            return;
        }
        await onSubmit(prepareConditionsToSend(conditionGroups), CreateParameterDrawerStepsEnum.CONDITIONS);
        setIsConditionsStep(false);
        cleanup();
    };

    const onDrawerSubmit = async (formData: SubmitParameterFormData | unknown) => {
        if (activeStep === CreateParameterDrawerStepsEnum.GENERAL_INFO) {
            await onSubmitGeneralParameterData(formData as SubmitParameterFormData);
            return;
        }
        await onSubmitConditions();
    };

    const onCloseDrawer = () => {
        setIsConditionsStep(false);
        setPrevFormValues(null);
        onClose();
        cleanup();
    };

    const onBack = () => {
        setIsConditionsStep(false);
        goToPrevStep();
        setupDrawerSize("lg");
        setupSubmitButtonText("Save");
    };

    useEffect(() => {
        isConditionsChanged && setupIsSubmitted();
    }, [isConditionsChanged]);

    return (
        <DrawerStepper
            onSubmit={onDrawerSubmit}
            onOptional={onBack}
            isOpen={isOpen}
            onClose={onCloseDrawer}
            onCancel={onCloseDrawer}
            steps={steps}
            size="lg"
            side="right"
            title={title}
            containerClass={`w-full ${isConditionsStep ? "min-w-3xl" : ""}`}
            isSubmitButtonDisabled={isSubmitButtonDisabled}
            headerButton={isConditionsStep ? <ConditionsHeaderButton /> : null}
            couldCloseOnBackdrop={!isConditionsStep}
        >
            <SubmitParameterStep
                options={defaultValues.options}
                error={error}
                onFetchingChange={onLookupsFetchComplete}
                uuid={uuid}
            />
            <ParameterConditions parameterUUID={uuid} isEdit={isEdit} parameterName={parameterName} />
        </DrawerStepper>
    );
};

export default observer(ParameterDrawer);
