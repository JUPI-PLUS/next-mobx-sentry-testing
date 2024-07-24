//  models
import { Lookup } from "../../../shared/models/form";
import { SampleStatuses } from "../../../shared/models/business/enums";

export interface SamplingErrorNotificationProps {
    barcode: string;
    updatedAt: number;
    status: SampleStatuses;
}

export interface FirstStepSamplingFormData {
    sample_number: string;
    sample_type: Lookup<number>;
}

export interface SamplingSecondStepProps {
    sampleNumber: string;
    setupExistsSampleUUID: (uuid: string) => void;
    userUUID: string;
}

export interface SecondStepSamplingFormData extends FirstStepSamplingFormData {
    volume: string;
    sampling_datetime: { from: Date };
    measure_unit: Lookup<number>;
    isPrintable: boolean;
}

// TODO: NO-USE
export interface GeneratedSampleBarcode {
    sample_barcode: string;
}

// TODO: NO-USE
export interface GenerateSampleBarcodeBySampleType {
    sample_type_id: number;
    order_number: string;
}

export enum SamplingDrawerSteps {
    ENTER_SAMPLE_NUMBER,
    SUBMIT_SAMPLE,
}

export interface SamplingDrawerProps {
    onClose: () => void;
    orderUUID: string;
    userUUID: string;
    orderNumber: string;
}
