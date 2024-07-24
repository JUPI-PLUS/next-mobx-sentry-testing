// libs
import { stringify } from "query-string";
import { useCallback, useEffect, useState } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import debounce from "lodash/debounce";
import { observer } from "mobx-react";

// stores
import { useKitTemplateStore } from "../../../../../store";

// api
import { getExamTemplatesList } from "../../../../../../../api/exams";

// helpers
import { filterExamTemplatesBySelected, transformExamTemplatesToSelectOption } from "../../../../../utils";

// models
import { ExamTemplateOption } from "../../models";

// constants
import { MAX_SELECTED_EXAM_TEMPLATES_LENGTH, MIN_EXAM_TEMPLATES_SEARCH_QUERY_LENGTH } from "../../../../../constants";
import { DEFAULT_DEBOUNCE_TIME } from "../../../../../../Workplace/constants";

// components
import ExamTemplateAutocomplete from "../ExamTemplateAutocomplete/ExamTemplateAutocomplete";
import ExamTemplateCardType from "../ExamTemplateCard/ExamTemplateCard";
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
        kitTemplateStore: {
            selectedExamTemplates,
            addSelectedExamTemplates,
            setupSelectedExamTemplates,
            examTemplateErrors,
            removeExamTemplate,
            removeExamTemplateErrors,
        },
    } = useKitTemplateStore();

    const {
        control,
        formState: { errors },
    } = useFormContext();
    const { append, remove, swap, fields } = useFieldArray({
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
            addSelectedExamTemplates([newValue]);
            setIsAddExamButtonVisible(true);
            setShouldScrollToBottom(true);
        }
    };

    const onMoveCard = useCallback(
        (dragIndex: number, hoverIndex: number) => {
            const copyOfExamTemplates = selectedExamTemplates.slice(0);
            copyOfExamTemplates.splice(dragIndex, 1);
            copyOfExamTemplates.splice(hoverIndex, 0, selectedExamTemplates[dragIndex]);
            // setup templates with new order
            setupSelectedExamTemplates(copyOfExamTemplates);
            // change order in form
            swap(dragIndex, hoverIndex);
        },
        [selectedExamTemplates]
    );

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
                {fields.map((field, index) => (
                    <ExamTemplateCardType
                        index={index}
                        examTemplate={selectedExamTemplates[index]}
                        key={field.id}
                        errorMessage={examTemplateErrors.length ? examTemplateErrors[index] : ""}
                        onRemoveClick={onExamTemplateRemove(index)}
                        onMoveCard={onMoveCard}
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
