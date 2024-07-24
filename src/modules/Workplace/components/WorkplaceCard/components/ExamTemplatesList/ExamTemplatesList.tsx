import { useEffect, useState } from "react";
import { stringify } from "query-string";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import debounce from "lodash/debounce";
import { observer } from "mobx-react";

// stores
import { useWorkplaceStore } from "../../../../store";

// api
import { getExamTemplatesList } from "../../../../../../api/exams";

// models
import { ExamTemplateOption } from "./models";

// constants
import {
    DEFAULT_DEBOUNCE_TIME,
    MAX_SELECTED_EXAM_TEMPLATES_LENGTH,
    MIN_EXAM_TEMPLATES_SEARCH_QUERY_LENGTH,
} from "../../../../constants";

// helpers
import { filterExamTemplatesBySelected, transformExamTemplatesToSelectOption } from "../../../../helpers";

// components
import ExamTemplateAutocomplete from "../ExamTemplateAutocomplete/ExamTemplateAutocomplete";
import ExamTemplateCard from "../ExamTemplateCard/ExamTemplateCard";
import AddExamButton from "./components/AddExamButton";

const loadExamTemplates =
    (selectedExamTemplatesUUIDs: string[]) =>
    (inputValue: string, callback: (options: ExamTemplateOption[]) => void) => {
        const trimmedValue = inputValue.trim();
        if (trimmedValue.length < MIN_EXAM_TEMPLATES_SEARCH_QUERY_LENGTH) {
            callback([]);
            return;
        }

        const queryFilters = stringify({ name: trimmedValue }, { skipEmptyString: true, skipNull: true });
        getExamTemplatesList(queryFilters).then(res => {
            const filteredExamTemplates = filterExamTemplatesBySelected(res.data.data, selectedExamTemplatesUUIDs);
            callback(transformExamTemplatesToSelectOption(filteredExamTemplates) ?? []);
        });
        return;
    };

const ExamTemplatesList = () => {
    const [isAddExamButtonVisible, setIsAddExamButtonVisible] = useState(true);
    const [shouldScrollToBottom, setShouldScrollToBottom] = useState(false);

    const {
        workplaceStore: {
            selectedExamTemplates,
            setupSelectedExamTemplates,
            examTemplateErrors,
            removeExamTemplate,
            removeExamTemplateErrors,
        },
    } = useWorkplaceStore();

    const {
        control,
        formState: { errors },
    } = useFormContext();

    const { append, remove } = useFieldArray({
        control,
        name: "exam_templates",
    });
    const examTemplatesUUIDs = useWatch({ name: "exam_templates", control });

    const onAddExamButtonClick = () => {
        setShouldScrollToBottom(true);
        setIsAddExamButtonVisible(false);
    };

    const onAutocompleteHide = () => {
        setIsAddExamButtonVisible(examTemplatesUUIDs.length !== 0);
    };

    const onExamTemplateRemove = (index: number) => () => {
        remove(index);
        removeExamTemplate(index);
        removeExamTemplateErrors(index);
    };

    const onAddExamTemplate = (newValue: ExamTemplateOption | null) => {
        if (newValue) {
            append(newValue.value);
            setupSelectedExamTemplates([newValue]);
            setIsAddExamButtonVisible(true);
            setShouldScrollToBottom(true);
        }
    };

    useEffect(() => {
        if (!selectedExamTemplates.length) {
            setIsAddExamButtonVisible(false);
            return;
        }
        setIsAddExamButtonVisible(true);
    }, [selectedExamTemplates.length]);

    return (
        <div className="flex flex-col gap-y-3">
            <h2 className="text-md font-bold">Exam templates</h2>
            <div className="flex flex-col gap-y-5">
                {selectedExamTemplates.map((examTemplate, index) => (
                    <ExamTemplateCard
                        examTemplate={examTemplate}
                        key={examTemplate.uuid}
                        errorMessage={examTemplateErrors.length ? examTemplateErrors[index] : ""}
                        onRemoveClick={onExamTemplateRemove(index)}
                    />
                ))}
            </div>
            {selectedExamTemplates.length < MAX_SELECTED_EXAM_TEMPLATES_LENGTH && (
                <>
                    {!isAddExamButtonVisible && (
                        <ExamTemplateAutocomplete
                            loadOptions={debounce(loadExamTemplates(examTemplatesUUIDs), DEFAULT_DEBOUNCE_TIME)}
                            onChange={onAddExamTemplate}
                            onHide={onAutocompleteHide}
                            errorMessage={(errors?.exam_templates?.message as string) || ""}
                            shouldScrollToBottom={shouldScrollToBottom}
                        />
                    )}
                    {isAddExamButtonVisible && (
                        <AddExamButton onClick={onAddExamButtonClick} shouldScrollToBottom={shouldScrollToBottom} />
                    )}
                </>
            )}
        </div>
    );
};

export default observer(ExamTemplatesList);
