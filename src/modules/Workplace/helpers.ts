import { ExamTemplate } from "../../shared/models/business/exam";
import { ServerFormValidationError } from "../../shared/models/axios";
import { ExamTemplateError } from "./models";

export const filterExamTemplatesBySelected = (templates: ExamTemplate[], selectedTemplatesUUIDs: string[]) => {
    return templates.filter(template => !selectedTemplatesUUIDs.includes(template.uuid));
};

export const transformExamTemplatesToSelectOption = (templates: ExamTemplate[]) =>
    templates.map(({ uuid, name, code, ...rest }) => ({
        uuid,
        name,
        code,
        value: uuid,
        label: `${name} (${code})`,
        ...rest,
    }));

export const getInvalidExamTemplates = (errors: Array<ServerFormValidationError>): Array<ExamTemplateError> => {
    const filteredExamTemplatesErrors = errors.filter(({ field }) => field.startsWith("exam_templates_uuids."));
    const allExamTemplatesErrors = new Array(filteredExamTemplatesErrors.length).fill(null);

    filteredExamTemplatesErrors.map(({ field, message }) => {
        const indexKey = Number(field.replace(/\D/g, ""));
        allExamTemplatesErrors[indexKey] = message[0];
    });

    return allExamTemplatesErrors;
};
