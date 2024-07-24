import { object, string } from "yup";
import { VALIDATION_MESSAGES } from "../../../../../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../../../../../shared/validation/rules";

const FORM_FIELDS = {
    TITLE: "title",
};

export const schema = object().shape({
    title: string()
        .max(50, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.TITLE, 50))
        .matches(REGEX_VALIDATION.LETTERS_NUMBERS_SYMBOLS_SPACES, VALIDATION_MESSAGES.ENTER_VALID(FORM_FIELDS.TITLE)),
});
