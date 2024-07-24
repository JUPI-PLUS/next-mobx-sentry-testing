import { PromisedServerResponse } from "../../shared/models/axios";
import { ExamTemplate } from "../../shared/models/business/exam";
import { limsClient } from "../config";
import { EXAMS_ENDPOINTS } from "./endpoints";
import { MoveExamKitRequest } from "../../modules/Templates/models";

export const getExamTemplatesList = (filters = ""): PromisedServerResponse<Array<ExamTemplate>> =>
    limsClient.get(EXAMS_ENDPOINTS.list(filters));

export const moveExamTemplatesToGroup = ({ body, uuid }: MoveExamKitRequest): PromisedServerResponse<ExamTemplate> =>
    limsClient.patch(EXAMS_ENDPOINTS.group(uuid), body);
