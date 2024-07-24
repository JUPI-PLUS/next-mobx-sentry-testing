import { boolean, mixed, object, string } from "yup";
import { VALIDATION_MESSAGES } from "../../../shared/validation/messages";
import { MAX_CODE_LENGTH, MIN_CODE_LENGTH } from "./constants";
import { trimRichTextSpaces } from "../../../shared/utils/string";

const FORM_FIELDS = {
    CODE: "Code",
    NAME: "Name",
    MEASURE_UNIT: "Measure unit",
    RESULT_TYPE: "Result type",
    BIOLOGICAL_REFERENCE_INTERVALS: "Biological reference intervals",
    NOTES: "Notes",
};

export const firstStepSchema = object().shape({
    parameterCodeAutocomplete: mixed().test({
        test: (option, ctx) => {
            if (option.__isNew__) {
                if (option.value.length < MIN_CODE_LENGTH) {
                    return ctx.createError({
                        message: VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.CODE, MIN_CODE_LENGTH),
                    });
                }

                if (option.value.length > MAX_CODE_LENGTH) {
                    return ctx.createError({
                        message: VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.CODE, MAX_CODE_LENGTH),
                    });
                }
            }

            return true;
        },
    }),
});

export const secondStepSchema = object().shape({
    code: string()
        .min(MIN_CODE_LENGTH, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.CODE, MIN_CODE_LENGTH))
        .max(MAX_CODE_LENGTH, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.CODE, MAX_CODE_LENGTH)),
    name: string()
        .min(2, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.NAME, 2))
        .max(300, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.NAME, 300)),
    si_measurement_units_id: object().nullable().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.MEASURE_UNIT)),
    type_view_id: object().nullable().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.RESULT_TYPE)),
    biological_reference_intervals: string()
        .nullable()
        .max(3000, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.BIOLOGICAL_REFERENCE_INTERVALS, 3000)),
    notes: string()
        .nullable()
        .transform(trimRichTextSpaces)
        .richTextMax(3000, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.NOTES, 3000)),
    is_printable: boolean(),
    is_required: boolean(),
});
