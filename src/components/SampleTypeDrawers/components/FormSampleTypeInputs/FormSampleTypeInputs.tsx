import { FC } from "react";
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";
import FormInput from "../../../uiKit/forms/Inputs/CommonInput/FormInput";
import { FormSampleTypeInputsProps } from "../../models";

const FormSampleTypesInputs: FC<FormSampleTypeInputsProps> = ({ error, isLoading }) => {
    useFormValidation({ isError: Boolean(error), errors: error! });

    return (
        <div className="flex flex-col gap-5">
            <FormInput label="Code" name="code" disabled={isLoading} data-testid={"sample-type-code-input"} />
            <FormInput label="Name" name="name" disabled={isLoading} data-testid={"sample-type-name-input"} />
        </div>
    );
};

export default FormSampleTypesInputs;
