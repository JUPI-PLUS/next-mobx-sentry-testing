// libs
import { AxiosResponse } from "axios";

// helpers
import { limsClient } from "../config";
import { SAMPLES_ENDPOINTS } from "./endpoints";

// models
import { PromisedServerResponse } from "../../shared/models/axios";
import {
    GeneratedSampleBarcode,
    GenerateSampleBarcodeBySampleType,
} from "../../components/SamplingDrawers/SamplingDrawer/models";
import {
    AttachSampleToExamsData,
    CreateSampleData,
    DetachExamsFromSampleData,
    SampleMarkAsDamagedPatch,
} from "../../modules/Order/components/ExaminationsTable/components/Cells/SampleNumberCell/components/SampleDropdown/models";
import { ExaminationBySample, FilteredExams, OrdersConditionBySample } from "../../modules/Examinations/models";
import { SampleDetails } from "../../shared/models/business/sample";
import { ExaminationSample } from "../../shared/models/business/exam";

export const getSamples = () => limsClient.get(SAMPLES_ENDPOINTS.root);

export const getSampleByBarcode = (barcode: string): PromisedServerResponse<ExaminationSample[]> =>
    limsClient.get(SAMPLES_ENDPOINTS.detailsByBarcode(barcode));

export const getSampleDetails = (uuid: string) => (): PromisedServerResponse<SampleDetails> =>
    limsClient.get(SAMPLES_ENDPOINTS.details(uuid));

export const patchSampleMarkAsDamaged = ({
    sampleChangeStatusPatchFields,
    uuid,
}: SampleMarkAsDamagedPatch): Promise<AxiosResponse> =>
    limsClient.patch(SAMPLES_ENDPOINTS.changeStatus(uuid), sampleChangeStatusPatchFields);

export const detachSampleFromExams = ({ exams, uuid }: DetachExamsFromSampleData): Promise<AxiosResponse> =>
    limsClient.post(SAMPLES_ENDPOINTS.detachExamsFromSample(uuid), exams);

export const attachSampleToExams = ({ exams, uuid }: AttachSampleToExamsData): Promise<AxiosResponse> =>
    limsClient.post(SAMPLES_ENDPOINTS.attachExamsFromSample(uuid), exams);

export const createSample = (sampleData: CreateSampleData): Promise<AxiosResponse> =>
    limsClient.post(SAMPLES_ENDPOINTS.root, sampleData);

export const generateBarcode = (
    sampleType: GenerateSampleBarcodeBySampleType
): PromisedServerResponse<GeneratedSampleBarcode> => limsClient.post(SAMPLES_ENDPOINTS.generateBarcode(), sampleType);

export const examinationsListOfSamples = (filters: string) => (): PromisedServerResponse<ExaminationSample, "list"> =>
    limsClient.get(SAMPLES_ENDPOINTS.examinationsList(filters));

export const examinationValidate = (filteredExams: FilteredExams): Promise<AxiosResponse> =>
    limsClient.patch(SAMPLES_ENDPOINTS.examinationValidate(), filteredExams);

export const examinationSave = (tableData: {
    sample_uuid: string;
    orders: Array<ExaminationBySample>;
}): Promise<AxiosResponse> => limsClient.post(SAMPLES_ENDPOINTS.examinationCreate(), tableData);

export const getExaminationListBySample = (uuid: string) => (): PromisedServerResponse<ExaminationBySample, "list"> =>
    limsClient.get(SAMPLES_ENDPOINTS.examinationListBySample(uuid));

export const detachExamsFromSample = ({ exams, uuid }: DetachExamsFromSampleData): PromisedServerResponse<Response> =>
    limsClient.post(SAMPLES_ENDPOINTS.detachExamsFromSample(uuid), exams);

export const getOrdersConditionsBySample =
    (uuid: string) => (): PromisedServerResponse<OrdersConditionBySample, "list"> =>
        limsClient.get(SAMPLES_ENDPOINTS.ordersConditionsBySample(uuid));
