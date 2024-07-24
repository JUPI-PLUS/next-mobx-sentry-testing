// libs
import React, { useMemo } from "react";

// helpers
import { useDisclosure } from "../../../../../../../shared/hooks/useDisclosure";
import { transformPathToSchemaPath } from "../../../../../utils";

// models
import { NotesContainerProps } from "../models";
import { ExamStatusesEnum } from "../../../../../../../shared/models/business/exam";

// components
import FormExamNotes from "./components/FormExamNotes";
import ViewExamNotes from "./components/ViewExamNotes";

const ExaminationNotes = ({ path, examStatus, className }: NotesContainerProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const schemaPath = useMemo(() => transformPathToSchemaPath(path), [path]);

    if (!isOpen) {
        return (
            <ViewExamNotes
                path={path}
                schemaPath={schemaPath}
                className={className}
                onClick={onOpen}
                isDisabled={examStatus === ExamStatusesEnum.DONE || examStatus === ExamStatusesEnum.FAILED}
            />
        );
    }

    return (
        <FormExamNotes
            path={path}
            schemaPath={schemaPath}
            className={className}
            onClick={onClose}
            isDisabled={examStatus === ExamStatusesEnum.DONE}
        />
    );
};

export default ExaminationNotes;
