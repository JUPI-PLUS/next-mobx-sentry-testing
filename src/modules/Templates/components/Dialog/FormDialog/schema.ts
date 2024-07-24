import { object, string } from "yup";
import { VALIDATION_MESSAGES } from "../../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../../shared/validation/rules";

export const nameSchema = object().shape({
    name: string()
        .required()
        .max(300, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS("Name", 300))
        .matches(REGEX_VALIDATION.LETTERS_NUMBERS_SYMBOLS_SPACES, VALIDATION_MESSAGES.ENTER_VALID("name")),
});
