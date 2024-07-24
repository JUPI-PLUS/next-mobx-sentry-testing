// libs
import React from "react";
import { observer } from "mobx-react";

// stores
import { useExaminationStore } from "../../../../../../store";

// helpers
import { trimRichTextSpaces } from "../../../../../../../../shared/utils/string";

// models
import { NotesProps } from "../../models";

// components
import { IconButton, TextButton } from "../../../../../../../../components/uiKit/Button/Button";
import SquarePencilIcon from "../../../../../../../../components/uiKit/Icons/SquarePencilIcon";
import ExpandableNotes from "../../ExpandableNotes/ExpandableNotes";
import PencilIconSmall from "../../../../../../../../components/uiKit/Icons/PencilSmallIcon";

const ViewParameterNotes = ({ path, schemaPath, isDisabled, className = "", onClick }: NotesProps) => {
    const {
        examinationStore: { getNotesByPath },
    } = useExaminationStore();

    const notes = trimRichTextSpaces(getNotesByPath(path));

    if (notes) {
        return (
            <div className={`flex justify-between items-start gap-1 ${className}`} data-testid="exam-notes-exists">
                <div className="flex items-start gap-1">
                    <p className="text-xs font-bold">Note:</p>
                    <ExpandableNotes notes={notes} schemaPath={schemaPath} />
                </div>
                {!isDisabled && (
                    <IconButton
                        aria-label="Edit parameter notes button"
                        size="thin"
                        variant="transparent"
                        data-testid={`${schemaPath}-edit-button`}
                        onClick={onClick}
                    >
                        <PencilIconSmall className="fill-dark-700" />
                    </IconButton>
                )}
            </div>
        );
    }

    if (isDisabled) return null;

    return (
        <div className={className} data-testid="exam-notes-does-not-exists">
            <TextButton
                aria-label="Add parameter notes button"
                text="Add note"
                variant="transparent"
                size="thin"
                className="text-xs"
                onClick={onClick}
                startIcon={<SquarePencilIcon className="fill-dark-700" />}
                data-testid={`${schemaPath}-add-button`}
            />
        </div>
    );
};

export default observer(ViewParameterNotes);
