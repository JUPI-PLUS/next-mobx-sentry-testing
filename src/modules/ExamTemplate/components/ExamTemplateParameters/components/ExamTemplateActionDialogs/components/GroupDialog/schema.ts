// helpers
import { object, string } from "yup";
import { VALIDATION_MESSAGES } from "../../../../../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../../../../../shared/validation/rules";

const FORM_FIELDS = {
    GROUP_NAME: "Group name",
};

export const schema = object().shape({
    name: string()
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.GROUP_NAME))
        .min(2, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.GROUP_NAME, 2))
        .max(300, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.GROUP_NAME, 300))
        .matches(
            REGEX_VALIDATION.LETTERS_NUMBERS_SYMBOLS_SPACES,
            VALIDATION_MESSAGES.ENTER_VALID(FORM_FIELDS.GROUP_NAME.toLowerCase())
        ),
});
