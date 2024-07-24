import { SubmitHandler } from "react-hook-form";
import { SampleChangeStatusFormFields } from "../../../modules/Order/components/ExaminationsTable/components/Cells/SampleNumberCell/components/SampleDropdown/models";
import { ExamOfSample } from "../../../shared/models/business/exam";

export type SampleChangeStatusDrawerProps = {
    exams: Array<ExamOfSample>;
    isOpen: boolean;
    onClose: () => void;
    onSubmit: SubmitHandler<SampleChangeStatusFormFields>;
};
