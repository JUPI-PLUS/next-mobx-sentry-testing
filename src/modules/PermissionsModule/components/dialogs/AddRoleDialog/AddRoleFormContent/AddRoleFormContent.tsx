import { AxiosError } from "axios";
import { FC } from "react";
import { useFormValidation } from "../../../../../../shared/hooks/useFormValidation";
import { BaseFormServerValidation } from "../../../../../../shared/models/axios";
import isEmpty from "lodash/isEmpty";
import FormInput from "../../../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";

const AddRoleFormContent: FC<{ error: AxiosError<BaseFormServerValidation> | null }> = ({ error }) => {
    useFormValidation({ isError: !isEmpty(error), errors: error });

    return <FormInput name="name" label="Name" containerClassName="mb-6" autoFocus data-testid="add-role-name" />;
};

export default AddRoleFormContent;
