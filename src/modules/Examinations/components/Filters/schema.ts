// helpers
import { object, string } from "yup";
import { FILTERS_VALIDATION_MESSAGES } from "../../../../shared/validation/messages";

// constants
import { MAX_SAMPLE_NUMBER_LENGTH, MIN_ORDER_NUMBER_LENGTH, MIN_SAMPLE_NUMBER_LENGTH } from "./constants";

export default object().shape({
    barcode: string().test((value, ctx) => {
        if (!value) return true;
        if (isNaN(Number(value))) {
            return ctx.createError({
                message: FILTERS_VALIDATION_MESSAGES.SHOULD_BE_NUMBER,
            });
        }
        if (value.length < MIN_SAMPLE_NUMBER_LENGTH) {
            return ctx.createError({
                message: FILTERS_VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(MIN_SAMPLE_NUMBER_LENGTH),
            });
        }

        if (value.length > MAX_SAMPLE_NUMBER_LENGTH) {
            return ctx.createError({
                message: FILTERS_VALIDATION_MESSAGES.MIN_MAX_LENGTH_SYMBOLS(
                    MIN_SAMPLE_NUMBER_LENGTH,
                    MAX_SAMPLE_NUMBER_LENGTH
                ),
            });
        }
        return true;
    }),
    exam_order_number: string().optionalMin(
        MIN_ORDER_NUMBER_LENGTH,
        FILTERS_VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(MIN_ORDER_NUMBER_LENGTH)
    ),
});
