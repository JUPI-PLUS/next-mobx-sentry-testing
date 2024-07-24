// libs
import { object, string } from "yup";

// helpers
import { deepTrim } from "../../../../shared/utils/string";

// constants
import { FILTERS_VALIDATION_MESSAGES, VALIDATION_MESSAGES } from "../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../shared/validation/rules";
import { MIN_SEARCH_STRING_LENGTH, MAX_SEARCH_STRING_LENGTH } from "../../constants";

const FORM_FIELDS = {
    name: "name or code",
};

export const schema = object().shape({
    name: string()
        .transform(deepTrim)
        .matches(REGEX_VALIDATION.LETTERS_NUMBERS_SYMBOLS_SPACES, VALIDATION_MESSAGES.ENTER_VALID(FORM_FIELDS.name))
        .min(MIN_SEARCH_STRING_LENGTH, FILTERS_VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(MIN_SEARCH_STRING_LENGTH))
        .max(MAX_SEARCH_STRING_LENGTH, FILTERS_VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(MAX_SEARCH_STRING_LENGTH)),
});
