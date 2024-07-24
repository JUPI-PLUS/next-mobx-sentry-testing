// libs
import { FC, useState } from "react";
import { observer } from "mobx-react";

// store
import { useExamTemplateStore } from "../../../../store";

// models
import { ExamTemplateGroupItemProps, ExamTemplateParamTypesEnum } from "../../models";

// components
import ExamTemplateParamActions from "./components/ExamTemplateParamActions/ExamTemplateParamActions";
import ExamTemplateParamIcon from "./components/ExamTemplateParamIcon/ExamTemplateParamIcon";
import ExamTemplateParameterItem from "./ExamTemplateParameterItem";

const ExamTemplateGroupItem: FC<ExamTemplateGroupItemProps> = ({
    parameter: { group_name: groupName, group_uuid: groupUUID, params },
}) => {
    const [detailsOpen, setDetailsOpen] = useState(false);

    const {
        examTemplateStore: { setActionType, setSelectedGroup },
    } = useExamTemplateStore();

    const areParamsEmpty = !Boolean(params?.length);

    const handleToggleDetailsOpen = () => !areParamsEmpty && setDetailsOpen(isOpen => !isOpen);

    const handleSetSelectedItem = () => {
        setSelectedGroup({ group_uuid: groupUUID, group_name: groupName });
    };

    return (
        <li className="border rounded-md relative group/folder border-dark-400">
            <div
                className={`flex justify-between items-start w-full gap-3 p-5 ${
                    detailsOpen && !areParamsEmpty && "border-b"
                }`}
            >
                <div className="flex w-full gap-2">
                    <ExamTemplateParamIcon
                        type={ExamTemplateParamTypesEnum.GROUP}
                        onToggleDetailsOpen={handleToggleDetailsOpen}
                        detailsOpen={detailsOpen}
                        shouldShowChevron={!areParamsEmpty}
                        uuid={groupUUID}
                    />
                    <p
                        className="text-md font-bold leading-6 break-word"
                        data-testid={`parameter-group-name-${groupUUID}`}
                    >
                        {groupName}
                    </p>
                </div>
                <ExamTemplateParamActions
                    setSelectedItem={handleSetSelectedItem}
                    setActionType={setActionType}
                    type={ExamTemplateParamTypesEnum.GROUP}
                    shouldShowDeleteIcon={areParamsEmpty}
                    uuid={groupUUID}
                />
            </div>
            {detailsOpen && (
                <ul>
                    {params?.map(param => (
                        <ExamTemplateParameterItem key={param.uuid} parameter={param} parentUUID={groupUUID} />
                    ))}
                </ul>
            )}
        </li>
    );
};

export default observer(ExamTemplateGroupItem);
