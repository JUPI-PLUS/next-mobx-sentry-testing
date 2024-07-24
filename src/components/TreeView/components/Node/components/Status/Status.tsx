// libs
import React, { FC, useMemo } from "react";
import { useQuery } from "react-query";

// models
import { TableStatusVariant } from "../../../../../../components/uiKit/Statuses/TableStatus/models";

// constants
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";

// helpers
import { getLookupItem, toLookupList } from "../../../../../../shared/utils/lookups";
import { getExamTemplateStatuses, getKitTemplateStatuses } from "../../../../../../api/dictionaries";

// components
import { TemplatesTreeNodeStatusesProps, TemplatesTypesEnum } from "../../../../models";
import { ExamTemplateStatusesEnum } from "../../../../../../shared/models/business/examTemplate";
import TableStatus from "../../../../../uiKit/Statuses/TableStatus/TableStatus";

const executeTemplateLookupQueries = async () => {
    const [examTemplateStatuses, kitTemplateStatuses] = await Promise.all([
        getExamTemplateStatuses(),
        getKitTemplateStatuses(),
    ]);

    return [examTemplateStatuses, kitTemplateStatuses];
};

const Status: FC<TemplatesTreeNodeStatusesProps> = ({ status, type }) => {
    const { data: [examTemplateStatusesLookup, kitTemplateStatusesLookup] = [[], []], isLoading } = useQuery(
        [DICTIONARIES_QUERY_KEYS.EXAM_TEMPLATE_STATUSES, DICTIONARIES_QUERY_KEYS.KIT_TEMPLATE_STATUSES],
        executeTemplateLookupQueries,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select(queryData) {
                const [examTemplateStatuses, kitTemplateStatuses] = queryData;
                return [toLookupList(examTemplateStatuses.data.data), toLookupList(kitTemplateStatuses.data.data)];
            },
        }
    );

    const [statusVariant, statusText]: [TableStatusVariant, string] = useMemo(() => {
        if (type === TemplatesTypesEnum.EXAM) {
            switch (status) {
                case ExamTemplateStatusesEnum.ACTIVE:
                    return [
                        "success",
                        getLookupItem(examTemplateStatusesLookup, ExamTemplateStatusesEnum.ACTIVE)?.label || "",
                    ];
                case ExamTemplateStatusesEnum.INACTIVE:
                default:
                    return [
                        "neutral",
                        getLookupItem(examTemplateStatusesLookup, ExamTemplateStatusesEnum.INACTIVE)?.label || "",
                    ];
            }
        } else {
            switch (status) {
                case ExamTemplateStatusesEnum.ACTIVE:
                    return [
                        "success",
                        getLookupItem(kitTemplateStatusesLookup, ExamTemplateStatusesEnum.ACTIVE)?.label || "",
                    ];
                case ExamTemplateStatusesEnum.INACTIVE:
                default:
                    return [
                        "neutral",
                        getLookupItem(kitTemplateStatusesLookup, ExamTemplateStatusesEnum.INACTIVE)?.label || "",
                    ];
            }
        }
    }, [examTemplateStatusesLookup, kitTemplateStatusesLookup, status, type]);

    return (
        <div className="h-full flex items-center">
            {!isLoading && <TableStatus variant={statusVariant} text={statusText} />}
        </div>
    );
};

export default React.memo(Status);
