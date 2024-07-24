import { object, string } from "yup";
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../shared/validation/rules";
import { isAfter } from "date-fns";

const FORM_FIELDS = {
    FIRST_NAME: "First name",
    LAST_NAME: "Last name",
    SEX: "Sex",
    BIRTHDATE: "Birthdate",
};

export const schema = object().shape({
    first_name: string()
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.FIRST_NAME))
        .max(255, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.FIRST_NAME, 255))
        .matches(
            REGEX_VALIDATION.LETTERS_NUMBERS_SPACES_HYPHEN,
            VALIDATION_MESSAGES.ENTER_VALID(FORM_FIELDS.FIRST_NAME)
        ),
    last_name: string()
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.LAST_NAME))
        .max(255, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.LAST_NAME, 255))
        .matches(
            REGEX_VALIDATION.LETTERS_NUMBERS_SPACES_HYPHEN,
            VALIDATION_MESSAGES.ENTER_VALID(FORM_FIELDS.LAST_NAME)
        ),
    sex: object().shape({}).nullable().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.SEX)),
    birth_date: object()
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.BIRTHDATE))
        .test(
            "isFuture",
            VALIDATION_MESSAGES.CANT_BE_FUTURE_DATE(FORM_FIELDS.BIRTHDATE),
            value => !isAfter(value.from, new Date())
        ),
});
