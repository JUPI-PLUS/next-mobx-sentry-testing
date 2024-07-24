// libs
import React, { useMemo } from "react";

// helpers
import { useDisclosure } from "../../../../../../../shared/hooks/useDisclosure";
import { transformPathToSchemaPath } from "../../../../../utils";

// models
import { NotesContainerProps } from "../models";
import { ExamStatusesEnum } from "../../../../../../../shared/models/business/exam";

// components
import FormParameterNotes from "./components/FormParameterNotes";
import ViewParameterNotes from "./components/ViewParameterNotes";

const ParameterNotes = ({ path, examStatus, className }: NotesContainerProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const schemaPath = useMemo(() => transformPathToSchemaPath(path), [path]);

    if (!isOpen) {
        return (
            <ViewParameterNotes
                path={path}
                schemaPath={schemaPath}
                className={className}
                onClick={onOpen}
                isDisabled={examStatus === ExamStatusesEnum.DONE}
            />
        );
    }

    return (
        <FormParameterNotes
            path={path}
            schemaPath={schemaPath}
            className={className}
            onClick={onClose}
            isDisabled={examStatus === ExamStatusesEnum.DONE}
        />
    );
};

export default ParameterNotes;
