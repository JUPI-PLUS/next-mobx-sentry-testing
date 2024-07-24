import { object, string } from "yup";
import { VALIDATION_MESSAGES } from "../../../../shared/validation/messages";

const FORM_FIELDS = {
    REFERRAL_DOCTOR: "Referral doctor",
    NOTES: "Notes",
};

export default object().shape({
    referral_doctor: string().max(100, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.REFERRAL_DOCTOR, 100)),
    referral_notes: string().max(3000, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS(FORM_FIELDS.NOTES, 3000)),
});
