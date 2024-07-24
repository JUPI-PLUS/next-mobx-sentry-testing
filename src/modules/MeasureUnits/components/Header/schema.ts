// libs
import { object, string } from "yup";

// constants
import { FILTERS_VALIDATION_MESSAGES, VALIDATION_MESSAGES } from "../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../shared/validation/rules";
import { MAX_SEARCH_STRING_LENGTH } from "../../constants";

const FORM_FIELDS = {
    search_string: "name",
};

export const schema = object().shape({
    search_string: string()
        .matches(
            REGEX_VALIDATION.LETTERS_NUMBERS_SYMBOLS_SPACES,
            VALIDATION_MESSAGES.ENTER_VALID(FORM_FIELDS.search_string)
        )
        .max(MAX_SEARCH_STRING_LENGTH, FILTERS_VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(MAX_SEARCH_STRING_LENGTH)),
});
