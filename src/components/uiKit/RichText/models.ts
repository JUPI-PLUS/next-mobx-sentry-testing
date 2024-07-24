import { ReactQuillProps } from "react-quill";

export interface RichTextProps extends ReactQuillProps {
    disabled?: boolean;
    label?: string;
    autoFocus?: boolean;
}

export interface FormRichTextProps extends RichTextProps {
    name: string;
    errorMessage?: string;
}
