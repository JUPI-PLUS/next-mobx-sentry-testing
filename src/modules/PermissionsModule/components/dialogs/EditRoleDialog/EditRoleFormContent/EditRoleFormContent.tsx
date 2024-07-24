import { AxiosError } from "axios";
import { FC } from "react";
import FormInput from "../../../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";
import { useFormValidation } from "../../../../../../shared/hooks/useFormValidation";
import { BaseFormServerValidation } from "../../../../../../shared/models/axios";
import isEmpty from "lodash/isEmpty";

const EditRoleFormContent: FC<{ error: AxiosError<BaseFormServerValidation> | null }> = ({ error }) => {
    useFormValidation({ isError: !isEmpty(error), errors: error });

    return (
        <FormInput name="name" label="Name" data-testid="edit-role-name-input" containerClassName="mb-6" autoFocus />
    );
};

export default EditRoleFormContent;
