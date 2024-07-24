export interface ExpandableNotesProps {
    notes: string | null;
    schemaPath?: string;
    className?: string;
}

export interface NotesContainerProps {
    className?: string;
    path: string;
    examStatus: number;
}

export type NotesProps = Omit<NotesContainerProps, "examStatus"> & {
    onClick: () => void;
    isDisabled: boolean;
    schemaPath: string;
};
