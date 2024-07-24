// helpers
import { limsClient } from "../config";
import { MEASURE_UNITS } from "./endpoints";

// models
import { PromisedServerResponse } from "../../shared/models/axios";
import { MeasureUnit } from "../../shared/models/business/measureUnits";
import { ExamTemplate } from "../../shared/models/business/exam";
import { Parameter } from "../../shared/models/business/parameter";

export const getMeasureUnitsList = (page: number, filters = ""): PromisedServerResponse<MeasureUnit, "list"> =>
    limsClient.get(MEASURE_UNITS.list(page, filters));

export const deleteMeasureUnit = (id: number): PromisedServerResponse => limsClient.delete(MEASURE_UNITS.item(id));

export const getMeasureUnitDetails = (id: number) => (): PromisedServerResponse<MeasureUnit> =>
    limsClient.get(MEASURE_UNITS.item(id));

export const getExamTemplatesByMeasureUnitId = (id: number) => (): PromisedServerResponse<ExamTemplate, "list"> =>
    limsClient.get(MEASURE_UNITS.examTemplates(id));

export const getParamsByMeasureUnitId = (id: number) => (): PromisedServerResponse<Parameter, "list"> =>
    limsClient.get(MEASURE_UNITS.params(id));

export const createMeasureUnit = (body: Omit<MeasureUnit, "id">): PromisedServerResponse<MeasureUnit> =>
    limsClient.post(MEASURE_UNITS.root, body);

export const patchMeasureUnit =
    (id: number) =>
    (body: Omit<MeasureUnit, "id">): PromisedServerResponse<MeasureUnit> =>
        limsClient.patch(MEASURE_UNITS.item(id), body);
