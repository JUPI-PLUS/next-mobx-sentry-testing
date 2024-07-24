//  libs
import { object, string } from "yup";

//  constants
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../shared/validation/rules";

const FORM_FIELDS = {
    EMAIL_TYPE: "Email type",
    EMAIL: "Email",
};

export const schema = object().shape({
    type_id: object().nullable(),
    email: string()
        .transform(value => value.toLowerCase())
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.EMAIL))
        .max(100, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.EMAIL, 100))
        .matches(REGEX_VALIDATION.EMAIL, VALIDATION_MESSAGES.ENTER_VALID(FORM_FIELDS.EMAIL)),
});
