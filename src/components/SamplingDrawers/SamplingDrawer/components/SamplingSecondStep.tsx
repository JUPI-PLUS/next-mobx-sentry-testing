//  libs
import React, { FC, useEffect, useState } from "react";
import { observer } from "mobx-react";
import { useQuery } from "react-query";
import { useFormContext } from "react-hook-form";
import { AxiosError } from "axios";

//  stores
import { useOrderStore } from "../../../../modules/Order/store";
import { useDrawerStepperStore } from "../../../DrawerStepper/store";

//  helpers
import { getLookupItem, toLookupList } from "../../../../shared/utils/lookups";
import { getMeasurementUnits, getSampleTypes } from "../../../../api/dictionaries";
import { getSampleByBarcode } from "../../../../api/samples";
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";

//  models
import { ServerResponse } from "../../../../shared/models/axios";
import { SampleStatuses } from "../../../../shared/models/business/enums";
import { ExaminationSample } from "../../../../shared/models/business/exam";
import { CommonServerValidationProps } from "../../../../shared/models/serverValidation";
import { SamplingSecondStepProps } from "../models";

//  constants
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS, SAMPLES_QUERY_KEYS } from "../../../../shared/constants/queryKeys";

//  components
import FormInput from "../../../uiKit/forms/Inputs/CommonInput/FormInput";
import FormDatetimePicker from "../../../uiKit/DatePickers/DatetimePicker/FormDatetimePicker";
import FormSelect from "../../../uiKit/forms/selects/Select/FormSelect";
import FormCheckbox from "../../../uiKit/forms/Checkbox/FormCheckbox";
import SamplingStatusErrorNotification from "./SamplingStatusErrorNotification";
import SamplingAttachErrorNotification from "./SamplingAttachErrorNotification";

const SamplingSecondStep: FC<SamplingSecondStepProps & CommonServerValidationProps> = ({
    sampleNumber,
    setupExistsSampleUUID,
    userUUID,
    isError,
    errors,
}) => {
    const {
        orderStore: { selectedExams },
    } = useOrderStore();
    const {
        drawerStepperStore: { disableSubmitButton, setupSubmitButtonText },
    } = useDrawerStepperStore();
    const { setValue } = useFormContext();
    const [isSampleCanBeAttached, setIsSampleCanBeAttached] = useState(true);
    const [isSampleExists, setIsSampleExists] = useState(false);
    const [isSampleBelongsToThisUser, setIsSampleBelongsToThisUser] = useState(true);

    useFormValidation({ isError, errors });

    const selectedExam = Array.from(selectedExams.values())[0];

    const onSampleFoundByBarcode = (queryData?: ExaminationSample) => {
        if (queryData) {
            const isSampleDamaged = queryData.sample_statuses_id === SampleStatuses.DAMAGED;
            const isSampleDone = queryData.sample_statuses_id === SampleStatuses.DONE;
            const isSampleBelongsToUser = queryData.user_uuid === userUUID;
            setValue("volume", queryData.volume);
            disableSubmitButton(isSampleDamaged || isSampleDone || !isSampleBelongsToUser);
            setIsSampleBelongsToThisUser(isSampleBelongsToUser);
            setIsSampleCanBeAttached(!(isSampleDamaged || isSampleDone));
            setIsSampleExists(true);
            setupExistsSampleUUID(queryData.uuid);
            return;
        }
        disableSubmitButton(false);
    };

    const {
        data: foundSample,
        isFetching,
        isPreviousData,
    } = useQuery<ServerResponse<ExaminationSample[]>, AxiosError, ExaminationSample>(
        SAMPLES_QUERY_KEYS.DETAILS_BY_BARCODE(sampleNumber),
        () => getSampleByBarcode(sampleNumber),
        {
            onSuccess(queryData) {
                onSampleFoundByBarcode(queryData);
            },
            select(queryData) {
                return queryData.data.data[0];
            },
        }
    );

    const { data: sampleTypesLookup, isLoading: isSampleTypesLookupLoading } = useQuery(
        DICTIONARIES_QUERY_KEYS.SAMPLE_TYPES,
        getSampleTypes,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select(queryData) {
                return toLookupList(queryData.data.data);
            },
        }
    );

    const { data: measurementUnitsLookup, isLoading: isMeasurementUnitsLookupLoading } = useQuery(
        DICTIONARIES_QUERY_KEYS.MEASUREMENT_UNITS,
        getMeasurementUnits,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select(queryData) {
                return toLookupList(queryData.data.data);
            },
        }
    );
    const isLoading = isSampleTypesLookupLoading || isMeasurementUnitsLookupLoading;

    useEffect(() => {
        if (measurementUnitsLookup?.length) {
            setValue(
                "measure_unit",
                getLookupItem(
                    measurementUnitsLookup,
                    foundSample ? foundSample?.si_measurement_units_id : selectedExam!.si_measurement_unit_id
                )
            );
        }
    }, [foundSample, measurementUnitsLookup?.length]);

    useEffect(() => {
        if (isFetching) {
            disableSubmitButton(true);
        }
    }, [isFetching]);

    useEffect(() => {
        setupSubmitButtonText(isSampleExists ? "Add to exam" : "Create sample");
    }, [isSampleExists]);

    const shouldShowStatusNotification = !isSampleCanBeAttached && !isPreviousData && foundSample;

    return (
        <>
            {shouldShowStatusNotification && (
                <SamplingStatusErrorNotification
                    barcode={foundSample?.barcode}
                    status={foundSample?.sample_statuses_id}
                    updatedAt={foundSample?.updated_at_timestamp}
                />
            )}
            {!isSampleBelongsToThisUser && <SamplingAttachErrorNotification />}
            <div className="mb-4">
                <FormInput name="sample_number" label="Sample number" disabled />
            </div>
            <div className="mb-4">
                <FormDatetimePicker
                    name="sampling_datetime"
                    label="Datetime"
                    disabled={isSampleExists || isFetching}
                    popperPlacement="bottom-start"
                    disabledDate={{ after: new Date() }}
                    popperClassName="z-50 border border-inset border-dark-300 shadow-card-shadow rounded-lg"
                    offsetDistance={5}
                    offsetSkidding={0}
                />
            </div>
            <div className="mb-4">
                <FormSelect label="Type" name="sample_type" options={sampleTypesLookup || []} disabled />
            </div>
            <div className="grid grid-cols-2 items-start justify-between gap-2">
                <div className="flex-grow">
                    <FormInput label="Volume" name="volume" disabled={isSampleExists} />
                </div>
                <div className="flex-grow">
                    <FormSelect
                        label="Measure unit"
                        name="measure_unit"
                        options={measurementUnitsLookup || []}
                        disabled={isLoading || isSampleExists || isFetching}
                    />
                </div>
            </div>
            <div className="mt-6">
                <FormCheckbox label="Print" name="isPrintable" />
            </div>
        </>
    );
};

export default observer(SamplingSecondStep);
