//  libs
import { mixed, object } from "yup";

//  helpers
import { VALIDATION_MESSAGES } from "../../../../../../shared/validation/messages";
import { REGEX_VALIDATION } from "../../../../../../shared/validation/rules";
import { toLowerCaseFirst } from "../../../../../../shared/utils/string";

//  constants
import { MAX_CREATE_OPTION_INPUT_LENGTH } from "../../constants";

export const FORM_FIELDS = {
    OPTION_NAME: "Option name",
};

export const schema = object().shape({
    name: mixed().test({
        test: (option, ctx) => {
            if (!option.label.length) {
                return ctx.createError({
                    message: VALIDATION_MESSAGES.REQUIRED(FORM_FIELDS.OPTION_NAME),
                });
            }
            if (option.label.length > MAX_CREATE_OPTION_INPUT_LENGTH) {
                return ctx.createError({
                    message: VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.OPTION_NAME, 45),
                });
            }
            if (!option.label.match(REGEX_VALIDATION.LETTERS_NUMBERS_SYMBOLS_SPACES)) {
                return ctx.createError({
                    message: VALIDATION_MESSAGES.ENTER_VALID(toLowerCaseFirst(FORM_FIELDS.OPTION_NAME)),
                });
            }
            return true;
        },
    }),
});
