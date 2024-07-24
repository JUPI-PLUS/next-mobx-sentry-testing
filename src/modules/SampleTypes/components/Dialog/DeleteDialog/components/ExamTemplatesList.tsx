import { observer } from "mobx-react";
import React, { FC, useEffect } from "react";
import { useQuery } from "react-query";
import { getExamTemplateStatuses } from "../../../../../../api/dictionaries";
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";
import { toLookupList } from "../../../../../../shared/utils/lookups";
import ExaminationTemplateItem from "../../../../../Parameters/components/ParametersTable/components/DeleteParameterDialog/components/ExaminationTemplateItem/ExaminationTemplateItem";
import { useParametersStore } from "../../../../../Parameters/store";
import { ExamTemplatesListProps } from "../../../../models";

const ExamTemplatesList: FC<ExamTemplatesListProps> = ({ list, sampleTypeName }) => {
    const {
        parametersStore: { setupExaminationTemplateStatusesLookup },
    } = useParametersStore();

    const { data: examTemplatesStatuses, isFetching: areExamTemplatesStatusesFetching } = useQuery(
        DICTIONARIES_QUERY_KEYS.EXAM_TEMPLATE_STATUSES,
        getExamTemplateStatuses,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    useEffect(() => {
        if (!areExamTemplatesStatusesFetching && examTemplatesStatuses) {
            setupExaminationTemplateStatusesLookup(examTemplatesStatuses);
        }
    }, [examTemplatesStatuses, areExamTemplatesStatusesFetching]);

    return (
        <div className="flex flex-col overflow-hidden">
            <div className="mb-6">
                You can't delete <span className="font-bold">{sampleTypeName}</span> sample type, because it is used in
                the following exam templates. You need to manually remove/change the sample type in the found analyses
            </div>
            <div className="overflow-auto">
                {list.map(({ code, name, uuid, status_id }) => (
                    <ExaminationTemplateItem key={uuid} code={code} statusId={status_id} name={name} uuid={uuid} />
                ))}
            </div>
        </div>
    );
};

export default observer(ExamTemplatesList);
