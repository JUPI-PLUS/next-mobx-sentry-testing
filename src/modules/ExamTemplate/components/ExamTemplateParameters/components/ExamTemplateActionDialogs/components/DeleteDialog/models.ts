// models
import { SelectedExamTemplateGroup } from "../../../../../../store";

export interface DeleteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    dialogTitle: string;
    onDeleteGroup: () => void;
    onDeleteParameter: () => void;
    selectedGroup: SelectedExamTemplateGroup | null;
    selectedParameterName?: string;
    examTemplateUUID: string;
}
