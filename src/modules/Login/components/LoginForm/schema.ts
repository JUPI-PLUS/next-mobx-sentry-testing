import { object, string } from "yup";
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../shared/validation/rules";
import { deepTrim, toLowerCaseFirst } from "../../../../shared/utils/string";

const FORM_FIELDS = {
    EMAIL: "Work e-mail",
    PASSWORD: "Password",
};

export const schema = object().shape({
    email: string()
        .transform(deepTrim)
        .transform(value => value.toLowerCase())
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.EMAIL))
        .matches(REGEX_VALIDATION.EMAIL, VALIDATION_MESSAGES.ENTER_VALID(toLowerCaseFirst(FORM_FIELDS.EMAIL))),
    password: string().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.PASSWORD)),
});
