// libs
import React from "react";

// helpers
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";

// models
import { EmailContactFormProps } from "./models";
import { CommonServerValidationProps } from "../../../../shared/models/serverValidation";

// components
import FormSelect from "../../../uiKit/forms/selects/Select/FormSelect";
import FormInput from "../../../uiKit/forms/Inputs/CommonInput/FormInput";

const EmailContactForm = ({
    isError,
    errors,
    emailTypesLookup,
    isVerified,
}: EmailContactFormProps & CommonServerValidationProps) => {
    useFormValidation({ isError, errors });

    return (
        <div className="flex flex-col gap-y-3">
            <FormSelect name="type_id" className="w-full" options={emailTypesLookup} label="Email type" />
            <FormInput name="email" label="Email" data-testid="contact-email-input" disabled={isVerified} />
        </div>
    );
};

export default EmailContactForm;
