// libs
import { FC } from "react";

// models
import { ExamTemplatesListProps } from "./models";

// components
import CircularProgressLoader from "../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";

const ExamTemplatesList: FC<ExamTemplatesListProps> = ({ examsTemplates, isExamsTemplatesFetching }) => {
    if (isExamsTemplatesFetching)
        return <CircularProgressLoader containerClassName="flex items-center justify-center h-full" />;

    return (
        <>
            <div className="font-bold">Exam templates:</div>
            <div className="flex flex-col gap-2 overflow-y-auto pr-5">
                {examsTemplates.length === 0 ? (
                    <div>No exam templates</div>
                ) : (
                    examsTemplates.map(({ name, uuid }) => <div key={uuid}>{name}</div>)
                )}
            </div>
        </>
    );
};
export default ExamTemplatesList;
