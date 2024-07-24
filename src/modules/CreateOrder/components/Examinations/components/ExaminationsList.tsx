import React from "react";
import { useQuery } from "react-query";
import { TEMPLATES_QUERY_KEYS } from "../../../../../shared/constants/queryKeys";
import { observer } from "mobx-react";
import { useCreateOrderStore } from "../../../store";
import ExaminationListItem from "./ExaminationListItem";
import CircularProgressLoader from "../../../../../components/uiKit/CircularProgressLoader/CircularProgressLoader";
import { TemplateTypeEnum } from "../../../../../shared/models/business/template";
import { getListOfTemplates, getParentsOfTemplate } from "../../../../../api/templates";
import FolderPath from "./FolderPath/FolderPath";

const ExaminationsList = () => {
    const {
        createOrderStore: {
            selectedKitsUUID,
            selectedExamTemplatesUUID,
            setupSelectedKit,
            setupSelectedExamTemplate,
            removeKit,
            removeExamTemplate,
            templatesFiltersQueryString,
            cleanupParentGroupUUID,
            setupParentGroupUUID,
            getTemplatesQuery,
            parentGroupUUID,
            currentGroupUUID,
        },
    } = useCreateOrderStore();

    const { data: templatesList = [], isFetching: isTemplatesListFetching } = useQuery(
        TEMPLATES_QUERY_KEYS.LIST(getTemplatesQuery),
        () => getListOfTemplates(getTemplatesQuery),
        {
            select: queryData => queryData.data.data,
            onError: () => {
                cleanupParentGroupUUID();
            },
            onSuccess: () => {
                if (currentGroupUUID && !Array.isArray(currentGroupUUID)) {
                    setupParentGroupUUID(currentGroupUUID);
                } else {
                    setupParentGroupUUID(null);
                }
            },
        }
    );

    const { data: templateParents = [], isFetching: isTemplateParentsFetching } = useQuery(
        TEMPLATES_QUERY_KEYS.PARENTS(parentGroupUUID!),
        () => getParentsOfTemplate(parentGroupUUID!),
        {
            select: queryData => queryData.data.data,
            enabled: Boolean(currentGroupUUID) && parentGroupUUID === currentGroupUUID,
        }
    );

    const onCheckboxChange = (type: TemplateTypeEnum) => (checked: boolean, uuid: string) => {
        // kit
        if (type === TemplateTypeEnum.KIT) {
            checked ? setupSelectedKit(uuid) : removeKit(uuid);
            return;
        }

        // exam template
        checked ? setupSelectedExamTemplate(uuid) : removeExamTemplate(uuid);
    };

    if (isTemplatesListFetching) return <CircularProgressLoader containerClassName="flex justify-center" />;

    return (
        <>
            {!templatesFiltersQueryString && (
                <FolderPath isFetching={isTemplateParentsFetching} templateParents={templateParents} />
            )}
            <div>
                {templatesList.map(({ name, uuid, item_type }) => (
                    <ExaminationListItem
                        key={uuid}
                        name={name}
                        uuid={uuid}
                        onChange={onCheckboxChange(item_type)}
                        type={item_type}
                        isChecked={selectedKitsUUID.has(uuid) || selectedExamTemplatesUUID.has(uuid)}
                    />
                ))}
            </div>
        </>
    );
};

export default observer(ExaminationsList);
