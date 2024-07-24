// libs
import { useFormContext } from "react-hook-form";
import { observer } from "mobx-react";
import { AxiosError } from "axios";
import isEmpty from "lodash/isEmpty";
import withScrolling from "../../../../../lib/dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

// stores
import { useKitTemplateStore } from "../../../store";

// helpers
import { useFormValidation } from "../../../../../shared/hooks/useFormValidation";

// models
import { BaseFormServerValidation } from "../../../../../shared/models/axios";

// components
import { SolidButton } from "../../../../../components/uiKit/Button/Button";
import FormInput from "../../../../../components/uiKit/forms/Inputs/CommonInput/FormInput";
import FormSelect from "../../../../../components/uiKit/forms/selects/Select/FormSelect";
import ExamTemplatesList from "./components/ExamTemplatesList/ExamTemplatesList";

const DndScrollWrapper = withScrolling("div");

const KitFormContent = ({ error }: { error: AxiosError<BaseFormServerValidation> | null }) => {
    const {
        kitTemplateStore: { kitTemplateStatusesLookup },
    } = useKitTemplateStore();

    const {
        formState: { isSubmitting, isDirty },
    } = useFormContext();

    useFormValidation({ isError: !isEmpty(error), errors: error });

    return (
        <>
            <div className="overflow-hidden h-full">
                <DndProvider backend={HTML5Backend}>
                    <DndScrollWrapper id="scrollable_element" className="w-full h-full overflow-y-auto px-0.5 pb-3">
                        <h2 className="text-md font-bold mb-4">General kit info</h2>
                        <div className="mb-10">
                            <div className="flex flex-col gap-y-3">
                                <FormInput name="name" label="Kit name" data-testid="kit-name-input" autoFocus />
                                <FormInput name="code" label="Kit code" data-testid="kit-code-input" />
                                <FormSelect
                                    name="status_id"
                                    className="w-full"
                                    disabled={!kitTemplateStatusesLookup.length}
                                    options={kitTemplateStatusesLookup}
                                    label="Status"
                                    placeholder="Kit status"
                                    menuPlacement="top"
                                />
                            </div>
                        </div>
                        <ExamTemplatesList />
                    </DndScrollWrapper>
                </DndProvider>
            </div>
            <div className="sticky left-0 right-0 bottom-0 w-full bg-white flex items-center justify-end border-t border-dark-400 pt-4 pb-20 mt-10">
                <SolidButton
                    type="submit"
                    text="Save"
                    disabled={isSubmitting || !isDirty}
                    data-testid="submit-button"
                />
            </div>
        </>
    );
};

export default observer(KitFormContent);
