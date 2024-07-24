//  libs
import { object, string } from "yup";

//  constants
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";

const FORM_FIELDS = {
    PHONE_TYPE: "Phone type",
    PHONE_NUMBER: "Phone number",
};

export const schema = object().shape({
    type_id: object().nullable(),
    number: string()
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.PHONE_NUMBER))
        .max(20, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.PHONE_NUMBER, 20))
        .phoneNumberValid(VALIDATION_MESSAGES.ENTER_VALID(FORM_FIELDS.PHONE_NUMBER)),
});
