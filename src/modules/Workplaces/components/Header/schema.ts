// libs
import { object, string } from "yup";

// constants
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";
import { MIN_FILTER_SEARCH_INPUT_LENGTH } from "../../constants";

export const schema = object().shape({
    search_string: string().optionalMin(
        MIN_FILTER_SEARCH_INPUT_LENGTH,
        VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS("Search string", MIN_FILTER_SEARCH_INPUT_LENGTH)
    ),
});
