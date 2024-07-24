//  libs
import { object, string } from "yup";

//  helpers
import { VALIDATION_MESSAGES } from "../../../shared/validation/messages";

const FORM_FIELDS = {
    NOTES: "Notes",
};

export const schema = object().shape({
    notes: string()
        .max(3000, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.NOTES, 3000))
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.NOTES)),
});
