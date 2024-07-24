// libs
import { object, string } from "yup";

// constants
import { REGEX_VALIDATION } from "../../../../../shared/validation/rules";
import { MAX_MEASURE_UNIT_NAME_LENGTH } from "../../../constants";
import { FILTERS_VALIDATION_MESSAGES, VALIDATION_MESSAGES } from "../../../../../shared/validation/messages";

const FORM_FIELDS = {
    name: "name",
};

export const schema = object().shape({
    name: string()
        .matches(REGEX_VALIDATION.LETTERS_NUMBERS_SYMBOLS_SPACES, VALIDATION_MESSAGES.ENTER_VALID(FORM_FIELDS.name))
        .max(
            MAX_MEASURE_UNIT_NAME_LENGTH,
            FILTERS_VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(MAX_MEASURE_UNIT_NAME_LENGTH)
        ),
});
