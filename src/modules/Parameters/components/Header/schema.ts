// libs
import { object, string } from "yup";

// helpers
import { deepTrim } from "../../../../shared/utils/string";

// constants
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../shared/validation/rules";

export const schema = object().shape({
    code: string()
        .transform(deepTrim)
        .matches(REGEX_VALIDATION.LETTERS_NUMBERS_SPACES, VALIDATION_MESSAGES.ENTER_VALID("code")),
});
