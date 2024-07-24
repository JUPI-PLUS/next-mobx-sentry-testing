import { object, string } from "yup";
import { VALIDATION_MESSAGES } from "../../../../../../../../shared/validation/messages";
import { MIN_SEARCH_STRING_LENGTH } from "../../../../../../../ParameterOptions/constants/filters";
import { MAX_SEARCH_STRING_LENGTH } from "../../../../../../../../shared/constants/filters";

export const schema = object().shape({
    name: string()
        .optionalMin(MIN_SEARCH_STRING_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS("Name", MIN_SEARCH_STRING_LENGTH))
        .max(MAX_SEARCH_STRING_LENGTH, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS("Name", MAX_SEARCH_STRING_LENGTH)),
});
