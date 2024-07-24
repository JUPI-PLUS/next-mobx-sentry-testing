// libs
import React from "react";

// helpers
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";

// models
import { PhoneContactFormProps } from "./models";
import { CommonServerValidationProps } from "../../../../shared/models/serverValidation";

// components
import FormSelect from "../../../uiKit/forms/selects/Select/FormSelect";
import FormPhoneInput from "../../../uiKit/PhoneInput/FormPhoneInput";

const PhoneContactForm = ({
    isError,
    errors,
    phoneTypesLookup,
    isVerified,
}: PhoneContactFormProps & CommonServerValidationProps) => {
    useFormValidation({ isError, errors });

    return (
        <div className="flex flex-col gap-y-3">
            <FormSelect name="type_id" className="w-full" options={phoneTypesLookup} label="Phone type" />
            <FormPhoneInput
                name="number"
                label="Phone number"
                data-testid="contact-phone-input"
                disabled={isVerified}
            />
        </div>
    );
};

export default PhoneContactForm;
