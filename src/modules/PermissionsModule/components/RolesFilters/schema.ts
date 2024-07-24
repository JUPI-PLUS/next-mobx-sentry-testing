import { object, string } from "yup";
import { deepTrim } from "../../../../shared/utils/string";
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../shared/validation/rules";

export const schema = object().shape({
    name: string()
        .transform(deepTrim)
        .max(45, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS("Name", 45))
        .matches(REGEX_VALIDATION.LETTERS_NUMBERS_SPACES, VALIDATION_MESSAGES.ENTER_VALID("name")),
});
