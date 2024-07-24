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
import ListCheckIcon from "../../../../../../../../components/uiKit/Icons/ListCheckIcon";
import PencilIconSmall from "../../../../../../../../components/uiKit/Icons/PencilSmallIcon";

const ViewExamNotes = ({ path, schemaPath, isDisabled, className = "", onClick }: NotesProps) => {
    const {
        examinationStore: { getNotesByPath },
    } = useExaminationStore();

    const notes = trimRichTextSpaces(getNotesByPath(path));

    if (notes) {
        return (
            <div className={`flex justify-between items-start gap-1 ${className}`} data-testid="exam-notes-exists">
                <div className="flex items-start gap-1 pt-1">
                    <p className="flex items-center gap-1 text-brand-100 text-xs font-bold pl-7 relative">
                        <ListCheckIcon className="absolute -top-1 left-0 fill-brand-100" />
                        Conclusion:
                    </p>
                    <ExpandableNotes notes={notes} schemaPath={schemaPath} className="mt-0" />
                </div>
                {!isDisabled && (
                    <IconButton
                        aria-label="Edit exam notes button"
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
                aria-label="Add exam notes button"
                text="Add conclusion"
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

export default observer(ViewExamNotes);
