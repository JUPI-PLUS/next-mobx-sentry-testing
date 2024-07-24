import { FC, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "quill-paste-smart";
import { RichTextProps } from "./models";

const RichText: FC<RichTextProps> = ({
    autoFocus,
    disabled = false,
    readOnly = false,
    label,
    className = "",
    ...rest
}) => {
    const editorRef = useRef<ReactQuill>(null);
    const isDisabled = disabled || readOnly;

    const focusOnInput = () => editorRef.current && editorRef.current.focus();

    useEffect(() => {
        // we should check for autoFocus only on mount with received props
        if (autoFocus && editorRef.current) {
            const { editor } = editorRef.current;
            if (!editor) {
                editorRef.current.focus();
                return;
            }

            editorRef.current.setEditorSelection(editor, {
                length: editor.getLength() || 0,
                index: editor.getLength() || 0,
            });
        }
    }, []);

    return (
        <div id="richText">
            {label && (
                <span
                    onClick={focusOnInput}
                    className="block mb-1.5 break-words text-xs font-medium text-dark-800 cursor-default"
                >
                    {label}
                </span>
            )}
            <ReactQuill
                bounds="#richText"
                ref={editorRef}
                theme="snow"
                modules={{
                    toolbar: [
                        ["bold", "italic", "underline", "strike"],
                        [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
                        ["link"],
                        ["clean"],
                    ],
                    clipboard: {
                        allowed: {
                            tags: ["a", "strong", "u", "s", "i", "p", "br", "ul", "ol", "li", "span"],
                            attributes: ["href", "rel", "target"],
                        },
                        keepSelection: false,
                        substituteBlockElements: true,
                        magicPasteLinks: true,
                    },
                }}
                className={`${isDisabled ? "ql-editor--disabled" : ""} ${className}`}
                readOnly={isDisabled}
                {...rest}
            />
        </div>
    );
};

export default RichText;
