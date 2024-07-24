import { object, string } from "yup";
import { VALIDATION_MESSAGES } from "../../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../../shared/validation/rules";

export const DEFAULT_VALUES = { name: "" };

export const schema = object().shape({
    name: string()
        .required()
        .min(3, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS("Name", 3))
        .max(45, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS("Name", 45))
        .matches(REGEX_VALIDATION.LETTERS_NUMBERS_SYMBOLS_SPACES, VALIDATION_MESSAGES.ENTER_VALID("role name")),
});
