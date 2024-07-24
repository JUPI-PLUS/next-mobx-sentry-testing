// libs
import { FC } from "react";

// models
import { ExamTemplateParamsListProps } from "./models";

// components
import ExamTemplateParameterItem from "../ExamTemplateItem/ExamTemplateParameterItem";

const ExamTemplateParamsList: FC<ExamTemplateParamsListProps> = ({ params }) => {
    return (
        <>
            {params.map(param => (
                <ExamTemplateParameterItem key={param.uuid} parameter={param} />
            ))}
        </>
    );
};

export default ExamTemplateParamsList;
