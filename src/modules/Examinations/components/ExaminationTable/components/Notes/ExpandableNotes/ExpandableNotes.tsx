// libs
import React, { useEffect, useMemo, useRef, useState } from "react";
import { observer } from "mobx-react";
import { useFormContext } from "react-hook-form";

// stores
import { useExaminationStore } from "../../../../../store";

// helpers
import { useDisclosure } from "../../../../../../../shared/hooks/useDisclosure";

// models
import { ExpandableNotesProps } from "../models";

// components
import ViewRichText from "../../../../../../../components/uiKit/RichText/ViewRichText";
import { TextButton } from "../../../../../../../components/uiKit/Button/Button";
import FieldError from "../../../../../../../components/uiKit/forms/FieldError/FieldError";

const ExpandableNotes = ({ notes, schemaPath, className }: ExpandableNotesProps) => {
    const textRef = useRef<HTMLDivElement>(null);
    const [isTextCut, setIsTextCut] = useState(false);

    const { isOpen, toggle } = useDisclosure();

    const {
        examinationStore: { isWindowResizing },
    } = useExaminationStore();

    const {
        formState: { errors },
    } = useFormContext();

    const errorMessage = useMemo(
        () => (schemaPath ? ((errors[schemaPath]?.message || "") as string) : ""),
        [errors, schemaPath]
    );

    useEffect(() => {
        if (!isWindowResizing) {
            const element = textRef.current;
            if (element && element.clientHeight < element.scrollHeight) {
                setIsTextCut(true);
            } else {
                setIsTextCut(false);
            }
        }
    }, [textRef, isWindowResizing]);

    if (!notes) return null;

    return (
        <div className={className}>
            <ViewRichText
                ref={textRef}
                className={`whitespace-pre-wrap break-word text-xs ${!isOpen ? "line-clamp-1" : ""}`}
                html={notes}
            />
            {isTextCut && (
                <TextButton
                    type="button"
                    text={isOpen ? "Show less" : "Show more"}
                    onClick={toggle}
                    variant="transparent"
                    size="thin"
                    className="font-bold text-xs"
                    data-testid="toggle-exam-button"
                />
            )}
            {errorMessage && <FieldError name={schemaPath} message={errorMessage} className="text-xs" />}
        </div>
    );
};

export default observer(ExpandableNotes);
