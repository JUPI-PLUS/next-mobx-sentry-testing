// libs
import React from "react";
import { observer } from "mobx-react";

// stores
import { useExaminationStore } from "../../../../../../store";

// models
import { NotesProps } from "../../models";

// components
import { TextButton } from "../../../../../../../../components/uiKit/Button/Button";
import FormRichText from "../../../../../../../../components/uiKit/RichText/FormRichText";

const FormExamNotes = ({ path, schemaPath, className, onClick, isDisabled }: NotesProps) => {
    const {
        examinationStore: { setupExaminationValue },
    } = useExaminationStore();

    const onNotesChange = (value: string) => {
        setupExaminationValue(path, value);
    };

    return (
        <div className={`leading-normal my-3 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <p className="break-words text-xs font-medium text-dark-800">Conclusion</p>
                <TextButton
                    text="Close"
                    size="thin"
                    variant="neutral"
                    className="font-medium text-xs"
                    onClick={onClick}
                    data-testid={`${schemaPath}-close-button`}
                />
            </div>
            <FormRichText name={schemaPath} onChange={onNotesChange} disabled={isDisabled} autoFocus />
        </div>
    );
};

export default observer(FormExamNotes);
