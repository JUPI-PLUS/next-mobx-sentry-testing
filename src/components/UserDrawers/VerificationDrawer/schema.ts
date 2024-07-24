//  libs
import { object, string } from "yup";

//  constants
import { VALIDATION_MESSAGES } from "../../../shared/validation/messages";

const FORM_FIELDS = {
    VERIFICATION_CODE: "Verification code",
};

export const schema = (length: number) =>
    object().shape({
        code: string()
            .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.VERIFICATION_CODE))
            .length(length, VALIDATION_MESSAGES.ENTER_VALID(FORM_FIELDS.VERIFICATION_CODE)),
    });
