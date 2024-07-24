// helpers
import { object, string } from "yup";
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../shared/validation/rules";

const FORM_FIELDS = {
    NAME: "Exam name",
    CODE: "Exam code",
    TERM: "Exam term",
    SAMPLE_TYPE: "Type",
    MEASURE_UNIT: "Measure unit",
    VOLUME: "Volume",
    PREPARATION: "Preparation",
    DESCRIPTION: "Description",
    STATUS: "Status",
    SAMPLE_PREFIX: "Sample prefix",
};

export const schema = object().shape({
    name: string()
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.NAME))
        .optionalMin(2, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.NAME, 2))
        .max(300, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.NAME, 300))
        .matches(
            REGEX_VALIDATION.LETTERS_NUMBERS_SYMBOLS_SPACES,
            VALIDATION_MESSAGES.ENTER_VALID(FORM_FIELDS.NAME.toLowerCase())
        ),
    code: string()
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.CODE))
        .optionalMin(2, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.CODE, 2))
        .max(10, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.CODE, 10))
        .matches(
            REGEX_VALIDATION.LETTERS_NUMBERS_SYMBOLS_SPACES,
            VALIDATION_MESSAGES.ENTER_VALID(FORM_FIELDS.CODE.toLowerCase())
        ),
    term: string().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.TERM)),
    sample_types_id: object().nullable().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.SAMPLE_TYPE)),
    si_measurement_units_id: object().nullable().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.MEASURE_UNIT)),
    volume: string().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.VOLUME)),
    preparation: string().nullable().max(3000, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.PREPARATION, 3000)),
    description: string().nullable().max(3000, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.DESCRIPTION, 3000)),
    status_id: object().nullable().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.STATUS)),
    sample_prefix: string().nullable(),
});
