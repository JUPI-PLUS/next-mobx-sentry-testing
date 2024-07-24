// libs
import { FC } from "react";

// models
import { FormWithValidationProps } from "../../models";

// hooks
import { useFormValidation } from "../../../../../../shared/hooks/useFormValidation";

// components
import FormInput from "../../../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";
import FormSelect from "../../../../../../components/uiKit/forms/selects/Select/FormSelect";
import FormTextArea from "../../../../../../components/uiKit/forms/TextArea/FormTextArea";

const AdditionInfo: FC<FormWithValidationProps> = ({ isError, errors }) => {
    useFormValidation({ isError, errors });

    return (
        <div className="max-h-full flex flex-col flex-1 gap-4 pb-9">
            <FormInput
                label="Electronic Health Card"
                name="electronic_health_card"
                data-testid="electronic-health-card"
                disabled
            />
            <FormSelect label="Citizenship" name="citizenship" data-testid="citizenship" options={[]} disabled />
            <FormSelect label="Preferred language" name="preferred_language" options={[]} disabled />
            <FormSelect label="Contingent" name="contingent" options={[]} disabled />
            <FormTextArea label="Notes" name="notes" data-testid="notes" disabled />
        </div>
    );
};
export default AdditionInfo;
