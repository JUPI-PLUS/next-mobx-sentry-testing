// libs
import { FC } from "react";

// helpers
import { useFormValidation } from "../../../../../../../../shared/hooks/useFormValidation";

// models
import { CommonServerValidationProps } from "../../../../../../../../shared/models/serverValidation";

// components
import FormInput from "../../../../../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";

const GroupForm: FC<CommonServerValidationProps> = ({ isError, errors }) => {
    useFormValidation({ isError, errors });
    return (
        <FormInput
            label="Group name"
            name="name"
            type="text"
            data-testid="add-group-name-input"
            containerClassName="mb-6"
            autoFocus
        />
    );
};
export default GroupForm;
