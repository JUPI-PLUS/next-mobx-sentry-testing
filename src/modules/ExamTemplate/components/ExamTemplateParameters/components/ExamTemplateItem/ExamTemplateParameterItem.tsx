// libs
import { FC, useMemo, useState } from "react";
import { observer } from "mobx-react";

// store
import { useExamTemplateStore } from "../../../../store";

// models
import { ExamTemplateParamsItemProps, ExamTemplateParamTypesEnum } from "../../models";

// components
import ExamTemplateParamActions from "./components/ExamTemplateParamActions/ExamTemplateParamActions";
import ExamTemplateParamIcon from "./components/ExamTemplateParamIcon/ExamTemplateParamIcon";
import ExamTemplateParamDetails from "./components/ExamTemplateParamDetails/ExamTemplateParamDetails";

const ExamTemplateParameterItem: FC<ExamTemplateParamsItemProps> = ({ parameter, parentUUID }) => {
    const [detailsOpen, setDetailsOpen] = useState(false);

    const {
        examTemplateStore: { setActionType, setSelectedItem },
    } = useExamTemplateStore();

    const parameterName = useMemo(() => `${parameter.code} - ${parameter.name}`, [parameter.name, parameter.code]);

    const onToggleDetailsOpen = () => setDetailsOpen(isOpen => !isOpen);

    const handleSetSelectedItem = () => {
        setSelectedItem(parameter, parentUUID);
    };

    return (
        <li
            className={`p-5 ${
                parentUUID ? "pl-0 ml-10 border-b last:border-b-0" : "border border-dark-400 rounded-md"
            } relative group/param`}
        >
            <div className="flex justify-between items-start w-full gap-3">
                <div className="flex w-full gap-2">
                    <ExamTemplateParamIcon
                        type={ExamTemplateParamTypesEnum.PARAMETER}
                        onToggleDetailsOpen={onToggleDetailsOpen}
                        detailsOpen={detailsOpen}
                        uuid={parameter.uuid}
                    />
                    <p
                        className="text-md font-bold leading-6 break-word"
                        data-testid={`parameter-param-name-${parameter.uuid}`}
                    >
                        {parameterName}
                    </p>
                </div>
                <ExamTemplateParamActions
                    setSelectedItem={handleSetSelectedItem}
                    setActionType={setActionType}
                    type={ExamTemplateParamTypesEnum.PARAMETER}
                    uuid={parameter.uuid}
                />
            </div>
            {detailsOpen && <ExamTemplateParamDetails details={parameter} />}
        </li>
    );
};

export default observer(ExamTemplateParameterItem);
