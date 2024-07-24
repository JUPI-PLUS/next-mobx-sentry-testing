import { faker } from "@faker-js/faker";
import { ExamTemplate } from "../../shared/models/business/exam";
import { ExamTemplatesDictionaryItem } from "../../shared/models/dictionaries";

export const MOCKED_EXAM_TEMPLATE = (templateId: number): ExamTemplate => ({
    id: templateId,
    name: faker.random.alpha(10),
    code: faker.random.alphaNumeric(10),
    sample_types_id: 1,
    sample_types_name: faker.random.alpha(10),
    uuid: faker.datatype.uuid(),
    status_id: 1,
    term: 150,
    description: faker.random.alpha(10),
    preparation: faker.random.alpha(10),
    si_measurement_units_id: 6,
    volume: 34,
    parent_group_uuid: faker.datatype.uuid(),
});

export const MOCKED_EXAM_TEMPLATE_ARRAY: Array<ExamTemplate> = new Array(10)
    .fill(0)
    .map((_, index: number) => MOCKED_EXAM_TEMPLATE(index));

export const MOCKED_EXAM_TEMPLATE_UUIDS = MOCKED_EXAM_TEMPLATE_ARRAY.map(exam => ({ exam_template_uuid: exam.uuid }));

export const MOCKED_EXAM_TEMPLATE_STATUSES: Array<ExamTemplatesDictionaryItem> = [
    {
        id: 1,
        name: "Active exam template status",
    },
];

const getExamTemplateError = (index: number) => ({
    field: `exam_templates.${index}.smth_else`,
    message: [`Exam_template field ${index} is required`],
    messageLocaliseId: [`exam_template_field_${index}_is_required`],
});

export const MOCKED_EXAM_TEMPLATE_ERROR = getExamTemplateError(0);
export const MOCKED_EXAM_TEMPLATE_ERROR2 = getExamTemplateError(2);
export const MOCKED_RANDOM_ERROR_OBJECT = {
    field: "some",
    message: ["Some field is required"],
    messageLocaliseId: ["some_field_is_required"],
};
