// helpers
import useScrollToBottom from "../../../../../../shared/hooks/useScrollToBottom";

// models
import { ExamTemplateOption } from "../ExamTemplatesList/models";
import { ExamTemplateAutocompleteProps } from "./models";

// components
import { IconButton } from "../../../../../../components/uiKit/Button/Button";
import Autocomplete from "../../../../../../components/uiKit/forms/selects/Autocomplete/Autocomplete";
import { XMarkIcon } from "@heroicons/react/24/outline";

const ExamTemplateAutocomplete = ({
    loadOptions,
    onChange,
    onHide,
    errorMessage,
    shouldScrollToBottom,
}: ExamTemplateAutocompleteProps) => {
    useScrollToBottom("scrollable_element", shouldScrollToBottom || Boolean(errorMessage));

    const clearIconClassName = errorMessage ? "self-center" : "self-end";

    return (
        <div className="flex items-baseline">
            <div className="w-full flex items-center">
                <Autocomplete<ExamTemplateOption>
                    name="exam_templates"
                    label="Exam template name"
                    loadOptions={loadOptions}
                    className="w-full"
                    selectClassName="flex-1"
                    onChange={onChange}
                    errorMessage={errorMessage}
                    menuPlacement="top"
                    autoFocus={shouldScrollToBottom}
                />
            </div>
            <IconButton
                aria-label="Remove exam template select"
                variant="transparent"
                className={`w-10 h-10 ${clearIconClassName}`}
                onClick={onHide}
                type="button"
            >
                <XMarkIcon className="w-6 h-6" />
            </IconButton>
        </div>
    );
};

export default ExamTemplateAutocomplete;
