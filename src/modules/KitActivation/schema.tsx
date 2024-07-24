// libs
import { mixed, object, string } from "yup";
import { ObjectShape } from "yup/lib/object";
import { trimRichTextSpaces } from "../../shared/utils/string";
import { VALIDATION_MESSAGES } from "../../shared/validation/messages";

// helpers
import { REGEX_VALIDATION } from "../../shared/validation/rules";
import { hiddenConditionsArray, OrderConditionResponse } from "./models";

const KIT_CODE_LENGTH = 12;
const FORM_FIELDS = {
    kitNumber: "Kit code",
    notes: "Notes",
    referralDoctor: "Referral doctor",
};

export const kitCodeSchema = object().shape({
    kit_number: string()
        .required()
        .length(KIT_CODE_LENGTH, VALIDATION_MESSAGES.EQUAL_LENGTH_SYMBOLS(FORM_FIELDS.kitNumber, KIT_CODE_LENGTH))
        .matches(REGEX_VALIDATION.NUMBERS_ONLY, VALIDATION_MESSAGES.ONLY_NUMBERS(FORM_FIELDS.kitNumber)),
});

export const conditionsSchema = (conditions: Array<OrderConditionResponse>) => {
    const values = object().shape({
        referral_doctor: string()
            .optionalMin(2, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.referralDoctor, 2))
            .max(300, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.referralDoctor, 300)),
        referral_notes: string()
            .optionalMin(2, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS(FORM_FIELDS.notes, 2))
            .transform(trimRichTextSpaces)
            .richTextMax(3000, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.notes, 3000)),
        ...conditions.reduce<{ [key: string]: ObjectShape[""] }>((acc, condition) => {
            if (!hiddenConditionsArray.includes(condition.id)) {
                acc[condition.name] = mixed().nullable().required(VALIDATION_MESSAGES.REQUIRED(condition.name));
            }
            return acc;
        }, {}),
    });

    return values;
};
