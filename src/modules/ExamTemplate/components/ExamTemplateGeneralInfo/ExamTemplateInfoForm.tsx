// libs
import React, { FC } from "react";
import { useFormContext } from "react-hook-form";
import { observer } from "mobx-react";

// helpers
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";

// stores
import { useExamTemplateStore } from "../../store";
import { useTemplatesStore } from "../../../Templates/store";

// models
import { CommonServerValidationProps } from "../../../../shared/models/serverValidation";

// components
import FormInput from "../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";
import FormSelect from "../../../../components/uiKit/forms/selects/Select/FormSelect";
import FormTextArea from "../../../../components/uiKit/forms/TextArea/FormTextArea";
import ExamTemplateFooter from "../ExamTemplateFooter/ExamTemplateFooter";
import FormMaskedNumberInput from "../../../../components/uiKit/forms/Inputs/MaskedInputs/FormMaskedNumberInput/FormMaskedNumberInput";

const ExamTemplateInfoForm: FC<CommonServerValidationProps> = ({ errors, isError }) => {
    const {
        templatesStore: { copiedExamTemplateUUID },
    } = useTemplatesStore();

    const {
        examTemplateStore: {
            examTemplateUUID,
            examTemplateDictionaries: { sampleTypesLookup, measurementUnitsLookup, examTemplateStatusesLookup },
        },
    } = useExamTemplateStore();

    useFormValidation({ isError, errors });

    const {
        formState: { isSubmitting, isDirty },
    } = useFormContext();

    const isSubmitButtonDisabled =
        isSubmitting || (!isDirty && !Boolean(examTemplateUUID) && !Boolean(copiedExamTemplateUUID));

    return (
        <>
            <div className="px-0.5 flex flex-col gap-3 mb-4 w-full overflow-y-scroll">
                <FormInput label="Code" name="code" data-testid="exam-general-code" />
                <FormInput label="Name" name="name" data-testid="exam-general-name" />
                <FormMaskedNumberInput label="Term" name="term" data-testid="exam-general-term" mask={Number} />
                <FormSelect label="Types ID" name="sample_types_id" options={sampleTypesLookup} />
                <FormSelect label="Measure unit" name="si_measurement_units_id" options={measurementUnitsLookup} />
                <FormMaskedNumberInput
                    label="Volume"
                    name="volume"
                    data-testid="exam-general-volume"
                    mask={Number}
                    scale={4}
                />
                <FormSelect label="Status" name="status_id" options={examTemplateStatusesLookup} />
                <FormTextArea label="Preparation" name="preparation" data-testid="exam-general-preparation" />
                <FormTextArea label="Description" name="description" data-testid="exam-general-description" />
                <FormMaskedNumberInput
                    label="Sample prefix"
                    name="sample_prefix"
                    data-testid="exam-general-sample-prefix"
                    mask={Number}
                    max={9}
                />
            </div>
            <ExamTemplateFooter
                submitText="Continue"
                isSubmitButtonDisabled={isSubmitButtonDisabled}
                containerClass="border-t pt-6"
            />
        </>
    );
};

export default observer(ExamTemplateInfoForm);
