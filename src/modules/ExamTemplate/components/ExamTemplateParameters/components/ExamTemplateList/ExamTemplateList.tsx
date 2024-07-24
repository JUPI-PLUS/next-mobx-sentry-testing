// libs
import { FC } from "react";

// models
import { ExamTemplateItemGroup, ExamTemplateItemParameter } from "../../models";
import { ExamTemplateListProps } from "./models";

// components
import ExamTemplateGroupItem from "../ExamTemplateItem/ExamTemplateGroupItem";
import ExamTemplateParamsList from "./ExamTemplateParamsList";

const ExamTemplateList: FC<ExamTemplateListProps> = ({ parameters }) => {
    return (
        <ul className="pr-3 flex flex-col gap-3 mb-4 w-full overflow-y-scroll">
            {parameters.map(parameter =>
                Boolean(parameter.group_name) ? (
                    <ExamTemplateGroupItem key={parameter.id} parameter={parameter as ExamTemplateItemGroup} />
                ) : (
                    <ExamTemplateParamsList
                        key={parameter.id}
                        params={(parameter as ExamTemplateItemParameter).params}
                    />
                )
            )}
        </ul>
    );
};

export default ExamTemplateList;
