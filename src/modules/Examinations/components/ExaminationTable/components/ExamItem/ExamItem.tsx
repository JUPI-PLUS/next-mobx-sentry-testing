// libs
import React from "react";

// models
import { ExamItemProps } from "./models";

// components
import ExamStatusBadge from "../ExamStatusBadge/ExamStatusBadge";
import ExpandableNotes from "../Notes/ExpandableNotes/ExpandableNotes";
import ExaminationNotes from "../Notes/ExaminationNotes/ExaminationNotes";
import ParameterItem from "../ParameterItem/ParameterItem";

const ExamItem = ({ exam, path }: ExamItemProps) => {
    return (
        <div className="rounded-lg border border-inset border-dark-400">
            <div className="p-4 bg-dark-100">
                <div className="flex justify-between items-start gap-2">
                    <p className="text-md font-bold break-word" data-testid="exam-name">
                        {exam.name}
                    </p>
                    <ExamStatusBadge statusId={exam.status_id} />
                </div>
                <ExpandableNotes notes={exam.exam_description} className="w-full mt-2" />
            </div>
            {exam.params.map((param, index) => (
                <ParameterItem
                    key={`${exam.uuid}-${param.uuid}`}
                    param={param}
                    examStatus={exam.status_id}
                    path={`${path}.params.${index}`}
                />
            ))}
            <ExaminationNotes
                path={`${path}.notes`}
                examStatus={exam.status_id}
                className="w-full p-4 border-t border-inset border-dark-400"
            />
        </div>
    );
};

export default ExamItem;
