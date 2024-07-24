//  libs
import { object } from "yup";
import { isAfter } from "date-fns";

//  helpers
import { VALIDATION_MESSAGES } from "../../../shared/validation/messages";

const FORM_FIELDS = {
    DATE: "Date",
    DAMAGE_REASON: "Reason",
};

export const schema = object().shape({
    updated_at: object().test({
        test: (value, ctx) => {
            if (!Boolean(value?.from))
                return ctx.createError({ message: VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.DATE) });

            if (isAfter(value.from, new Date()))
                return ctx.createError({ message: VALIDATION_MESSAGES.CANT_BE_FUTURE_DATE(FORM_FIELDS.DATE) });

            return true;
        },
    }),
    damage_reason: object().nullable().required(VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.DAMAGE_REASON)),
});
