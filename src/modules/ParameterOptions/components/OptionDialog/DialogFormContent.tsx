// libs
import React, { FC } from "react";
import { AxiosError } from "axios";
import isEmpty from "lodash/isEmpty";

// components
import FormInput from "../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";

// models
import { BaseFormServerValidation } from "../../../../shared/models/axios";

// hooks
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";

const DialogFormContent: FC<{ error: AxiosError<BaseFormServerValidation> | null }> = ({ error }) => {
    useFormValidation({ isError: !isEmpty(error), errors: error });

    return (
        <div className="mb-6">
            <FormInput data-testid="option-name-field" name="name" label="Name" autoFocus />
        </div>
    );
};

export default DialogFormContent;
