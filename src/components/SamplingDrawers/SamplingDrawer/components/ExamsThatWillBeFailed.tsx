import { FC } from "react";
import { ExamOfSample } from "../../../../shared/models/business/exam";

const ExamsThatWillBeFailed: FC<{ exams: Array<ExamOfSample> | undefined }> = ({ exams }) => {
    if (!exams || exams.length === 0) return null;

    return (
        <div className="overflow-y-hidden">
            <p className="font-bold">Exams that will be failed:</p>
            <div className="overflow-y-auto h-full">
                {exams.map(exam => {
                    return <div key={exam.uuid}>{exam.name}</div>;
                })}
            </div>
        </div>
    );
};

export default ExamsThatWillBeFailed;
