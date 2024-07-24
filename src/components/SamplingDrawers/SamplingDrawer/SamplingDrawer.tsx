//  libs
import React, { FC, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useMutation, useQuery } from "react-query";
import { getUnixTime } from "date-fns";
import { AxiosError, AxiosResponse } from "axios";

//  stores
import { useDrawerStepperStore } from "../../DrawerStepper/store";
import { useOrderStore } from "../../../modules/Order/store";

//  helpers
import { firstStepSchema, secondStepSchema } from "./schema";
import { attachSampleToExams, createSample, detachSampleFromExams, generateBarcode } from "../../../api/samples";
import { queryClient } from "../../../../pages/_app";
import { onSamplingFinish } from "./utils";
import { showErrorToast } from "../../uiKit/Toast/helpers";

//  models
import {
    FirstStepSamplingFormData,
    SamplingDrawerProps,
    SamplingDrawerSteps,
    SecondStepSamplingFormData,
} from "./models";
import { BaseFormServerValidation } from "../../../shared/models/axios";
import { CreateSampleData } from "../../../modules/Order/components/ExaminationsTable/components/Cells/SampleNumberCell/components/SampleDropdown/models";

// helpers
import { Lookup } from "../../../shared/models/form";
import { getSampleTypes } from "../../../api/dictionaries";
import { getLookupItem, toLookupList } from "../../../shared/utils/lookups";

//  constants
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS, ORDERS_QUERY_KEYS, SAMPLES_QUERY_KEYS } from "../../../shared/constants/queryKeys";
import { EXAM_ALREADY_HAVE_SAMPLES } from "../../../shared/constants/order";

//  components
import DrawerStepper from "../../../components/DrawerStepper/DrawerStepper";
import SamplingFirstStep from "./components/SamplingFirstStep";
import SamplingSecondStep from "./components/SamplingSecondStep";

const SamplingDrawer: FC<SamplingDrawerProps> = ({ onClose, orderUUID, orderNumber, userUUID }) => {
    const {
        drawerStepperStore: { activeStep, disableSubmitButton, goToNextStep, goToPrevStep, setupIsSubmitted },
    } = useDrawerStepperStore();
    const {
        orderStore: {
            examinationDetailsBasedOnAction,
            selectedExams,
            lastRequestedOrdersQueryKey,
            resetSampleActionType,
            resetOrderExams,
            resetIsSingleItemAction,
        },
    } = useOrderStore();
    const isPrintable = useRef(false);
    const [pickedSampleNumber, setPickedSampleNumber] = useState("");
    const [sampleType, setSampleType] = useState<Lookup<number> | null>(null);
    const [existsSampleUUID, setExistsSampleUUID] = useState("");
    const [isResampling, setIsResampling] = useState(false);

    const { mutateAsync: generateSampleBarcode } = useMutation(
        SAMPLES_QUERY_KEYS.GENERATE_SAMPLE_NUMBER,
        generateBarcode,
        {
            onSuccess(queryData) {
                setPickedSampleNumber(queryData.data.data.sample_barcode);
            },
        }
    );

    const {
        mutateAsync: createSampleMutation,
        isError,
        error,
    } = useMutation<AxiosResponse, AxiosError<BaseFormServerValidation>, CreateSampleData>(createSample, {
        async onSuccess(createdSampleData) {
            await onSamplingFinish(
                isResampling,
                isPrintable.current,
                createdSampleData.data.data.uuid,
                createdSampleData.data.data.user_uuid
            );
            onDrawerClose();
        },
        async onError(errorCreate) {
            const errorMessage = errorCreate.response?.data.errors[0].message[0] as string;
            if (errorMessage === EXAM_ALREADY_HAVE_SAMPLES) {
                showErrorToast({ title: "Can't create sample", message: EXAM_ALREADY_HAVE_SAMPLES });
            } else {
                showErrorToast({ title: "Can't create sample" });
            }
            if (lastRequestedOrdersQueryKey) {
                await queryClient.refetchQueries(lastRequestedOrdersQueryKey);
            }
            await queryClient.refetchQueries(ORDERS_QUERY_KEYS.ONE(orderUUID));
            onDrawerClose();
        },
    });

    const { mutateAsync: detachSampleMutation } = useMutation(detachSampleFromExams);
    const { mutateAsync: attachSampleMutation } = useMutation(attachSampleToExams, {
        async onSuccess(createdSampleData) {
            await onSamplingFinish(
                isResampling,
                isPrintable.current,
                createdSampleData.data.data.uuid,
                createdSampleData.data.data.user.uuid
            );
            onDrawerClose();
        },
    });

    const { data: sampleTypesLookup } = useQuery(DICTIONARIES_QUERY_KEYS.SAMPLE_TYPES, getSampleTypes, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select(queryData) {
            return toLookupList<Lookup<number>>(queryData.data.data);
        },
    });

    const steps = useMemo(
        () => [
            {
                title: "Add sample",
                backText: "",
                saveText: "Generate new barcode",
                schema: firstStepSchema,
                defaultValues: {
                    sample_number: pickedSampleNumber,
                    sample_type:
                        sampleType ||
                        getLookupItem(sampleTypesLookup, examinationDetailsBasedOnAction[0]!.sample_type)!,
                },
            },
            {
                title: "Add sample",
                backText: "Back",
                saveText: "Save",
                schema: secondStepSchema,
                defaultValues: {
                    sample_number: pickedSampleNumber,
                    sample_type: sampleType!,
                    measure_unit: null,
                    sampling_datetime: { from: new Date() },
                    volume: Array.from(selectedExams.values()).reduce((acc, { volume }) => acc + volume, 0),
                    isPrintable: true,
                },
            },
        ],
        [sampleTypesLookup?.length, sampleType?.value, selectedExams, pickedSampleNumber]
    );

    const onDrawerClose = () => {
        resetSampleActionType();
        resetOrderExams();
        resetIsSingleItemAction();
        setIsResampling(false);
        onClose();
    };

    const setupExistsSampleUUID = (uuid: string) => {
        setExistsSampleUUID(uuid);
    };

    const onFirstStepSubmitted = async (formData: FirstStepSamplingFormData) => {
        if (formData.sample_number) {
            setPickedSampleNumber(formData.sample_number);
        } else {
            await generateSampleBarcode({
                sample_type_id: formData.sample_type.value,
                order_number: orderNumber,
            });
        }
        setSampleType(formData.sample_type);
        goToNextStep();
    };

    const onSecondStepSubmitted = async (formData: SecondStepSamplingFormData) => {
        try {
            const selectedExamsArray = examinationDetailsBasedOnAction;
            const sampleValues = selectedExamsArray.map(exam => exam!.sample_uuid);
            const isSampleExistOnExams = Boolean(sampleValues.filter(Boolean).length);
            const examUUIDs = selectedExamsArray.map(exam => ({ exam_uuid: exam!.exam_uuid }));
            setIsResampling(isSampleExistOnExams);
            isPrintable.current = formData.isPrintable;

            if (existsSampleUUID) {
                if (isSampleExistOnExams) {
                    await detachSampleMutation({
                        uuid: sampleValues[0],
                        exams: { exams: examUUIDs },
                    });
                }

                await attachSampleMutation({
                    uuid: existsSampleUUID,
                    exams: { exams: examUUIDs },
                });
            } else {
                if (isSampleExistOnExams) {
                    await detachSampleMutation({
                        uuid: sampleValues[0],
                        exams: { exams: examUUIDs },
                    });
                }

                await createSampleMutation({
                    uuid: orderUUID,
                    sampling_datetime: getUnixTime(formData.sampling_datetime.from!),
                    sample_barcode: formData.sample_number,
                    sample_type_id: formData.sample_type!.value,
                    volume: Number(formData.volume),
                    si_measurement_units_id: formData.measure_unit!.value,
                    exams: selectedExamsArray.map(exam => ({ exam_id: exam!.exam_id })),
                });
            }
            if (lastRequestedOrdersQueryKey) {
                await queryClient.refetchQueries(lastRequestedOrdersQueryKey);
            }
            await queryClient.refetchQueries(ORDERS_QUERY_KEYS.ONE(orderUUID));
        } catch (e) {
            throw e;
        }
    };

    const onSubmit = async (formData: FirstStepSamplingFormData | SecondStepSamplingFormData) => {
        try {
            if (activeStep === SamplingDrawerSteps.ENTER_SAMPLE_NUMBER) {
                setupIsSubmitted();
                await onFirstStepSubmitted(formData);
                return;
            }

            await onSecondStepSubmitted(formData as SecondStepSamplingFormData);
        } catch (e) {}
    };

    const onOptionalButtonClick = () => {
        setIsResampling(false);
        disableSubmitButton(false);
        goToPrevStep();
    };

    return (
        <DrawerStepper
            onSubmit={onSubmit}
            isOpen
            onClose={onDrawerClose}
            onCancel={onDrawerClose}
            onOptional={onOptionalButtonClick}
            steps={steps}
            side="right"
            size="lg"
            title="Add sample"
        >
            <SamplingFirstStep />
            <SamplingSecondStep
                sampleNumber={pickedSampleNumber}
                setupExistsSampleUUID={setupExistsSampleUUID}
                userUUID={userUUID}
                errors={error}
                isError={isError}
            />
        </DrawerStepper>
    );
};

export default observer(SamplingDrawer);
