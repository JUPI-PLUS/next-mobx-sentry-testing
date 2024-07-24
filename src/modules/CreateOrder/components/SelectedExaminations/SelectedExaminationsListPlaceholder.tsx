import ExamIcon from "../../../../components/uiKit/Icons/ExamIcon";

const SelectedExaminationsListPlaceholder = () => (
    <div className="flex flex-col items-center gap-4 mt-20">
        <span className="p-4 bg-dark-300 flex items-center justify-center rounded-full">
            <ExamIcon />
        </span>
        <p className="text-center text-md">You have not added exams or kits</p>
    </div>
);

export default SelectedExaminationsListPlaceholder;
