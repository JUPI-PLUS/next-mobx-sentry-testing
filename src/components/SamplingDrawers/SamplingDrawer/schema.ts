//  libs
import { object, string } from "yup";
import { isAfter } from "date-fns";

//  helpers
import { VALIDATION_MESSAGES } from "../../../shared/validation/messages";

const FORM_FIELDS = {
    SAMPLE_NUMBER: "Sample number",
    DATETIME: "Datetime",
    SAMPLE_TYPE: "Type",
    MEASURE_UNIT: "Measure unit",
    VOLUME: "Volume",
};

export const firstStepSchema = object().shape({
    sample_number: string()
        .optionalMin(10, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.SAMPLE_NUMBER, 10))
        .max(14, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.SAMPLE_NUMBER, 14))
        .test("isItNumber", VALIDATION_MESSAGES.ONLY_NUMBERS(FORM_FIELDS.SAMPLE_NUMBER), value => {
            return !isNaN(Number(value));
        }),
    sample_type: object().nullable().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.SAMPLE_TYPE)),
});

export const secondStepSchema = object().shape({
    sample_type: object().nullable().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.SAMPLE_TYPE)),
    measure_unit: object().nullable().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.MEASURE_UNIT)),
    sampling_datetime: object().test({
        test: (value, ctx) => {
            if (!Boolean(value?.from))
                return ctx.createError({ message: VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.DATETIME) });

            if (isAfter(value.from, new Date()))
                return ctx.createError({ message: VALIDATION_MESSAGES.CANT_BE_FUTURE_DATE(FORM_FIELDS.DATETIME) });

            return true;
        },
    }),
    volume: string()
        .required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.VOLUME))
        .test("isItNumber", VALIDATION_MESSAGES.ONLY_NUMBERS(FORM_FIELDS.SAMPLE_NUMBER), value => {
            return !isNaN(Number(value));
        }),
});
