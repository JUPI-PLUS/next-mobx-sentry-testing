import { object, string } from "yup";
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../shared/validation/rules";

const FORM_FIELDS = {
    name: "Name",
};

export const schema = object().shape({
    name: string()
        .required()
        .max(45, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.name, 45))
        .matches(REGEX_VALIDATION.LETTERS_NUMBERS_SPACES, VALIDATION_MESSAGES.NUMBER_LETTERS(FORM_FIELDS.name)),
});
