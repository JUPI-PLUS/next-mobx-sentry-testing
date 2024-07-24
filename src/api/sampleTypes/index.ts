// helpers
import { limsClient } from "../config";
import { SAMPLES_TYPES } from "./endpoints";

// models
import { PromisedServerResponse } from "../../shared/models/axios";
import { SampleType } from "../../shared/models/business/sampleTypes";
import { ExamTemplate } from "../../shared/models/business/exam";

export const getSampleTypesList = (page: number, filters = ""): PromisedServerResponse<SampleType, "list"> =>
    limsClient.get(SAMPLES_TYPES.list(page, filters));

export const deleteSampleType = (id: number): PromisedServerResponse => limsClient.delete(SAMPLES_TYPES.item(id));

export const getSampleTypeDetails = (id: number) => (): PromisedServerResponse<SampleType> =>
    limsClient.get(SAMPLES_TYPES.item(id));

export const getExamTemplatesBySampleTypeId = (id: number) => (): PromisedServerResponse<ExamTemplate, "list"> =>
    limsClient.get(SAMPLES_TYPES.examTemplates(id));

export const createSampleType = (body: Omit<SampleType, "id">): PromisedServerResponse<SampleType> =>
    limsClient.post(SAMPLES_TYPES.root, body);

export const patchSampleType =
    (id: number) =>
    (body: Omit<SampleType, "id">): PromisedServerResponse<SampleType> =>
        limsClient.patch(SAMPLES_TYPES.item(id), body);
