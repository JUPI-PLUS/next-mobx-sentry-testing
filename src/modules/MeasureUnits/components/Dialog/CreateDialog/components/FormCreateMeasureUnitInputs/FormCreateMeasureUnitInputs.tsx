import { FC } from "react";
import FormInput from "../../../../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";
import { useFormValidation } from "../../../../../../../shared/hooks/useFormValidation";
import { FormCreateMeasureUnitInputsProps } from "../../../models";

const FormCreateMeasureUnitInputs: FC<FormCreateMeasureUnitInputsProps> = ({ isError, errors }) => {
    useFormValidation({ isError, errors });

    return (
        <div className="mb-8">
            <FormInput name="name" label="Name" data-testid="create-name-input" autoFocus />
        </div>
    );
};

export default FormCreateMeasureUnitInputs;
