import { mixed, object, string } from "yup";
import { VALIDATION_MESSAGES } from "../../../../../../shared/validation/messages";
import { ObjectShape } from "yup/lib/object";
import { OrderConditionResponse, hiddenConditionsArray } from "../../../../models";
import { trimRichTextSpaces } from "../../../../../../shared/utils/string";

export const schema = (conditions: Array<OrderConditionResponse>) => {
    const values = object().shape({
        referral_doctor: string()
            .optionalMin(2, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS("Referral doctor", 2))
            .max(300, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS("Referral doctor", 300)),
        referral_notes: string()
            .optionalMin(2, VALIDATION_MESSAGES.MIN_LENGTH_SYMBOLS("Notes", 2))
            .transform(trimRichTextSpaces)
            .richTextMax(3000, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS("Notes", 3000)),
        ...conditions.reduce<{ [key: string]: ObjectShape[""] }>((acc, condition) => {
            if (!hiddenConditionsArray.includes(condition.id)) {
                acc[condition.name] = mixed().nullable().required(VALIDATION_MESSAGES.REQUIRED(condition.name));
            }
            return acc;
        }, {}),
    });

    return values;
};
