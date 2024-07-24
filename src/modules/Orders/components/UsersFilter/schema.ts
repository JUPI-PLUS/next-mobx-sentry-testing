// libs
import { object, string } from "yup";

// helpers
import { FILTERS_VALIDATION_MESSAGES } from "../../../../shared/validation/messages";

// constants
import { MAX_BARCODE_LENGTH, MIN_BARCODE_LENGTH, MIN_FILTER_STRING_LENGTH } from "./constants";

export default object().shape({
    barcode: string()
        .optionalMin(MIN_BARCODE_LENGTH, FILTERS_VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(MIN_BARCODE_LENGTH))
        .max(
            MAX_BARCODE_LENGTH,
            FILTERS_VALIDATION_MESSAGES.MIN_MAX_LENGTH_SYMBOLS(MIN_BARCODE_LENGTH, MAX_BARCODE_LENGTH)
        ),
    first_name: string().optionalMin(
        MIN_FILTER_STRING_LENGTH,
        FILTERS_VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(MIN_FILTER_STRING_LENGTH)
    ),
    last_name: string().optionalMin(
        MIN_FILTER_STRING_LENGTH,
        FILTERS_VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(MIN_FILTER_STRING_LENGTH)
    ),
    email: string().optionalMin(
        MIN_FILTER_STRING_LENGTH,
        FILTERS_VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(MIN_FILTER_STRING_LENGTH)
    ),
});
