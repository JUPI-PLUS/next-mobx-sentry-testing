import { object, string } from "yup";
import { VALIDATION_MESSAGES } from "../../../../../../../../shared/validation/messages";
import { trimRichTextSpaces } from "../../../../../../../../shared/utils/string";

const FORM_FIELDS = {
    NOTES: "notes",
};

export const schema = object().shape({
    intervalNotes: string()
        .transform(trimRichTextSpaces)
        .richTextMax(3000, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.NOTES, 3000)),
});
