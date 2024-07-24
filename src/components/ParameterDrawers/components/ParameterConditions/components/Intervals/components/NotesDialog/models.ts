export interface NotesDialogProps {
    onClose: () => void;
    rowIndex: number;
    conditionGroupIndex: number;
}

export interface NotesDialogFormData {
    intervalNotes: string;
}
