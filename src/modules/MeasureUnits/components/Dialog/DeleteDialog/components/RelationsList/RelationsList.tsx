import { observer } from "mobx-react";
import React, { FC, useEffect } from "react";
import { useQuery } from "react-query";
import { getExamTemplateStatuses } from "../../../../../../../api/dictionaries";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS } from "../../../../../../../shared/constants/queryKeys";
import { toLookupList } from "../../../../../../../shared/utils/lookups";
import ExaminationTemplateItem from "./components/ExaminationTemplateItem/ExaminationTemplateItem";
import { useParametersStore } from "../../../../../../Parameters/store";
import { RelationsListProps } from "../../../../../models";
import ParamItem from "./components/ParamItem/ParamItem";

const RelationsList: FC<RelationsListProps> = ({ measureUnitName, examTemplatesList, paramsList }) => {
    const {
        parametersStore: { setupExaminationTemplateStatusesLookup },
    } = useParametersStore();

    const { data: examTemplateStatuses = [], isFetching: isExamTemplateStatusesFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.EXAM_TEMPLATE_STATUSES,
        getExamTemplateStatuses,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    useEffect(() => {
        if (examTemplateStatuses.length && !isExamTemplateStatusesFetching) {
            setupExaminationTemplateStatusesLookup(examTemplateStatuses);
        }
    }, [examTemplateStatuses.length, isExamTemplateStatusesFetching]);

    return (
        <div className="flex flex-col overflow-hidden">
            <div className="mb-6">
                You can't delete <span className="font-bold">{measureUnitName}</span> measure unit, because it is used
                in the following exam templates. You need to manually remove/change the measure unit in the found
                analyses
            </div>
            <div className="overflow-auto flex flex-col gap-4">
                {examTemplatesList.map(({ code, name, uuid, status_id }) => (
                    <ExaminationTemplateItem key={uuid} code={code} statusId={status_id} name={name} uuid={uuid} />
                ))}
                {paramsList.map(param => (
                    <ParamItem key={param.uuid} {...param} />
                ))}
            </div>
        </div>
    );
};

export default observer(RelationsList);
