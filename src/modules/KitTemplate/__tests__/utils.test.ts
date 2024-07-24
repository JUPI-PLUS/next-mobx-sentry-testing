import {
    MOCKED_EXAM_TEMPLATE_ERROR,
    MOCKED_EXAM_TEMPLATE_ERROR2,
    MOCKED_RANDOM_ERROR_OBJECT,
} from "../../../testingInfrustructure/mocks/exams";
import { getInvalidExamTemplates } from "../utils";

describe("getInvalidExamTemplates", () => {
    it("Should equal ['Exam_template field 0 is required']", () => {
        const errorMessage = getInvalidExamTemplates([MOCKED_EXAM_TEMPLATE_ERROR]);
        expect(errorMessage).toEqual([MOCKED_EXAM_TEMPLATE_ERROR.message[0]]);
    });

    it("Should equal ['Exam_template field 0 is required', null, 'Exam_template field 2 is required']", () => {
        const errorMessage = getInvalidExamTemplates([
            MOCKED_EXAM_TEMPLATE_ERROR,
            MOCKED_RANDOM_ERROR_OBJECT,
            MOCKED_EXAM_TEMPLATE_ERROR2,
        ]);

        expect(errorMessage).toEqual([
            MOCKED_EXAM_TEMPLATE_ERROR.message[0],
            null,
            MOCKED_EXAM_TEMPLATE_ERROR2.message[0],
        ]);
    });
});
