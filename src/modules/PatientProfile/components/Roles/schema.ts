import { mixed, object } from "yup";
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";

const FORM_FIELDS = {
    ROLES: "Roles",
};

export const schema = object().shape({
    roles: mixed().nullable().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.ROLES)),
});
