import { FC } from "react";
import ExaminationTemplateItem from "../../../../../modules/Parameters/components/ParametersTable/components/DeleteParameterDialog/components/ExaminationTemplateItem/ExaminationTemplateItem";
import CircularProgressLoader from "../../../../uiKit/CircularProgressLoader/CircularProgressLoader";
import { ExamTemplatesListProps } from "../../models";

const ExamTemplatesList: FC<ExamTemplatesListProps> = ({ list, isLoading }) => {
    return (
        <div className="mt-5 overflow-auto h-full">
            {isLoading ? (
                <CircularProgressLoader containerClassName="flex justify-center" />
            ) : (
                list.map(({ code, name, uuid, status_id }) => (
                    <ExaminationTemplateItem key={uuid} code={code} statusId={status_id} name={name} uuid={uuid} />
                ))
            )}
        </div>
    );
};

export default ExamTemplatesList;
