import { object, string } from "yup";
import { MAX_SAMPLE_TYPE_NAME_LENGTH, SAMPLE_TYPE_CODE_LENGTH } from "../../modules/SampleTypes/constants";
import { VALIDATION_MESSAGES } from "../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../shared/validation/rules";

const FORM_FIELDS = {
    CODE: "Code",
    NAME: "Name",
};

export const schema = object().shape({
    code: string()
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.CODE))
        .length(SAMPLE_TYPE_CODE_LENGTH, VALIDATION_MESSAGES.EQUAL_LENGTH_SYMBOLS(FORM_FIELDS.CODE, 2))
        .matches(REGEX_VALIDATION.NUMBERS_ONLY, VALIDATION_MESSAGES.ONLY_NUMBERS(FORM_FIELDS.CODE)),
    name: string()
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.NAME))
        .max(MAX_SAMPLE_TYPE_NAME_LENGTH, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.NAME, 45))
        .matches(REGEX_VALIDATION.LETTERS_NUMBERS_SYMBOLS_SPACES, VALIDATION_MESSAGES.ENTER_VALID(FORM_FIELDS.NAME)),
});
