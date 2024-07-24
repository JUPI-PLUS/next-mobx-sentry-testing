// libs
import React from "react";
import { useFormContext } from "react-hook-form";

// helpers
import { useFormValidation } from "../../../../shared/hooks/useFormValidation";

// models
import { WorkplaceFormProps } from "../../models";

// components
import FormSelect from "../../../../components/uiKit/forms/selects/Select/FormSelect";
import FormInput from "../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";
import { SolidButton } from "../../../../components/uiKit/Button/Button";
import ExamTemplatesList from "./components/ExamTemplatesList/ExamTemplatesList";
import FormRichText from "../../../../components/uiKit/RichText/FormRichText";

const WorkplaceForm = ({ isError, errors, generalStatusesLookup }: WorkplaceFormProps) => {
    const {
        formState: { isSubmitting, isDirty },
    } = useFormContext();

    useFormValidation({ isError, errors });

    return (
        <div className="flex flex-col w-full h-full">
            <div id="scrollable_element" className="w-full h-full overflow-y-scroll pl-0.5 pr-2 pb-3">
                <h2 className="text-md font-bold mb-4">General workplace info</h2>
                <div className="flex flex-col gap-y-3 mb-10">
                    <FormInput name="name" label="Name" data-testid="workplace-name-input" autoFocus />
                    <FormInput name="code" label="Code" data-testid="workplace-code-input" />
                    <FormSelect
                        name="status_id"
                        className="w-full"
                        disabled={!generalStatusesLookup.length}
                        options={generalStatusesLookup}
                        label="Status"
                        placeholder="Workplace status"
                    />
                    <FormRichText name="notes" label="Notes" data-testid="workplace-notes-input" />
                </div>
                <ExamTemplatesList />
            </div>
            <div className="sticky bottom-0 w-full flex items-center justify-end border-t border-dark-400 pt-4 pb-20 mt-10">
                <SolidButton
                    type="submit"
                    text="Save"
                    disabled={isSubmitting || !isDirty}
                    data-testid="submit-button"
                />
            </div>
        </div>
    );
};

export default WorkplaceForm;
