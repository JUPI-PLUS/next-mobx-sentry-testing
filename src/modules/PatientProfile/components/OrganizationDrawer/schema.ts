import { mixed, object } from "yup";
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";

export const schema = object().shape({
    organization: mixed().nullable().required(VALIDATION_MESSAGES.REQUIRED("Organization")),
    position: mixed().nullable().required(VALIDATION_MESSAGES.REQUIRED("Position")),
});
