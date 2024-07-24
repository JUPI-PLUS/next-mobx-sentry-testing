// libs
import { useMemo } from "react";
import isEmpty from "lodash/isEmpty";
import { usePhone } from "react-international-phone";

// helpers
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";

// models
import { CodeVerificationFormProps } from "../models";

// constants
import { VERIFICATION_FIELD_TYPES } from "../constants";

// components
import FormVerificationInput from "../../../uiKit/forms/VerificationInput/VerificationInput/FormVerificationInput";

const CodeVerificationForm = ({ codeLength, verificationField, error, type }: CodeVerificationFormProps) => {
    useFormValidation({ isError: !isEmpty(error), errors: error });
    const { phone } = usePhone(verificationField.value);

    const message = useMemo(() => {
        switch (type) {
            case VERIFICATION_FIELD_TYPES.EMAIL:
                return "Enter the code we sent you to the email";
            case VERIFICATION_FIELD_TYPES.PHONE:
                return "Enter the code that we sent in SMS to the number";
            default:
                return "";
        }
    }, [type]);

    const value = useMemo(() => {
        switch (type) {
            case VERIFICATION_FIELD_TYPES.EMAIL:
                return verificationField.value;
            case VERIFICATION_FIELD_TYPES.PHONE:
                return phone;
            default:
                return "";
        }
    }, [type, phone, verificationField.value]);

    return (
        <>
            <p className="mb-2 text-sm leading-5 text-dark-800">{message}</p>
            <p className="mb-12 text-md font-bold">{value}</p>
            <FormVerificationInput name="code" length={codeLength} inputClassName="justify-center" />
        </>
    );
};

export default CodeVerificationForm;
