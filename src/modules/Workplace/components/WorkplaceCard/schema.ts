// libs
import { array, object, string } from "yup";

// helpers
import { toLowerCaseFirst, trimRichTextSpaces } from "../../../../shared/utils/string";

// constants
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../shared/validation/rules";

const FORM_FIELDS = {
    NAME: "Workplace name",
    CODE: "Workplace code",
    STATUS: "Status",
    NOTES: "Notes",
    EXAM_TEMPLATE: "Exam template",
};

export const schema = object().shape({
    code: string()
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.CODE))
        .min(2, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.CODE, 2))
        .max(10, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.CODE, 10))
        .matches(REGEX_VALIDATION.LETTERS_NUMBERS_SYMBOLS_SPACES, VALIDATION_MESSAGES.ENTER_VALID(FORM_FIELDS.CODE)),
    name: string()
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.NAME))
        .min(2, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.NAME, 2))
        .max(100, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.NAME, 100))
        .matches(
            REGEX_VALIDATION.LETTERS_NUMBERS_SYMBOLS_SPACES,
            VALIDATION_MESSAGES.ENTER_VALID(toLowerCaseFirst(FORM_FIELDS.NAME))
        ),
    status_id: object().nullable(),
    notes: string()
        .nullable()
        .transform(trimRichTextSpaces)
        .richTextMax(9000, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.NOTES, 9000)),
    exam_templates: array(),
});
