import { boolean, mixed, object, string } from "yup";
import { VALIDATION_MESSAGES } from "../../../shared/validation/messages";
import { trimRichTextSpaces } from "../../../shared/utils/string";

const FORM_FIELDS = {
    PARAMETER_CODE: "Parameter code",
    PARAMETER_NAME: "Parameter name",
    MEASURE_ID: "Measure unit",
    BIOLOGICAL_REFERENCE_INTERVALS: "Biological reference intervals",
    RESULT_TYPE: "Result type",
    NOTES: "Notes",
};

export const schema = object().shape({
    code: string()
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.PARAMETER_CODE))
        .min(2, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.PARAMETER_CODE, 2))
        .max(10, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.PARAMETER_CODE, 10)),
    name: string()
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.PARAMETER_NAME))
        .min(2, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.PARAMETER_NAME, 2))
        .max(300, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.PARAMETER_NAME, 300)),
    si_measurement_units_id: object().nullable().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.MEASURE_ID)),
    type_view_id: object().nullable().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.RESULT_TYPE)),
    biological_reference_intervals: string().max(
        3000,
        VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.BIOLOGICAL_REFERENCE_INTERVALS, 3000)
    ),
    notes: string()
        .nullable()
        .transform(trimRichTextSpaces)
        .richTextMax(3000, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.NOTES, 3000)),
    options: mixed(),
    is_printable: boolean(),
    is_required: boolean(),
});
