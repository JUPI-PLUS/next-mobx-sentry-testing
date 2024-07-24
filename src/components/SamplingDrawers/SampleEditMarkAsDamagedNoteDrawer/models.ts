import { SubmitHandler } from "react-hook-form";
import { SampleChangeMarkAsDamagedNoteFormFields } from "../../../modules/Order/components/ExaminationsTable/components/Cells/SampleNumberCell/components/SampleDropdown/models";
import { ExamOfSample } from "../../../shared/models/business/exam";

export type SampleEditMarkAsDamagedNoteDrawerProps = {
    exams: Array<ExamOfSample> | undefined;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: SubmitHandler<SampleChangeMarkAsDamagedNoteFormFields>;
};
