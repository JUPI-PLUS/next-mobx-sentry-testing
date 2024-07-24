// libs
import React from "react";

// models
import { ProgressExaminationsProps } from "./models";

const ProgressExaminations = ({ exams }: ProgressExaminationsProps) => {
    if (!Boolean(exams.length)) return null;

    return (
        <div className="mb-6">
            <h2 className="text-md font-bold mb-2 px-3">Analysen in Bearbeitung</h2>
            <ul>
                {exams.map(exam => (
                    <li key={exam.uuid} className="flex first:border-t border-b py-1 px-3">
                        <div className="w-3/4">{exam.name}</div>
                        <div className="w-1/4 text-right">UNKNOWN</div>
                        <div className="w-1/4 text-right">In Bearbeitung</div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProgressExaminations;
