// libs
import { FC, memo, useMemo } from "react";
import { useQuery } from "react-query";

// models
import { TableStatusVariant } from "../../../../../../../components/uiKit/Statuses/TableStatus/models";
import { TemplateStatusesProps } from "../../../../../models";
import { TemplateStatusEnum, TemplateTypeEnum } from "../../../../../../../shared/models/business/template";

// constants
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS } from "../../../../../../../shared/constants/queryKeys";

// helpers
import { getLookupItem, toLookupList } from "../../../../../../../shared/utils/lookups";
import { getExamTemplateStatuses, getKitTemplateStatuses } from "../../../../../../../api/dictionaries";

// components
import TableStatus from "../../../../../../../components/uiKit/Statuses/TableStatus/TableStatus";

const StatusCell: FC<TemplateStatusesProps> = ({ status, type }) => {
    const { data: kitTemplateStatusesLookup, isLoading: isKitTemplateStatusesLookupLoading } = useQuery(
        DICTIONARIES_QUERY_KEYS.KIT_TEMPLATE_STATUSES,
        getKitTemplateStatuses,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const { data: examTemplateStatusesLookup, isLoading: isExamTemplateStatusesLookupLoading } = useQuery(
        DICTIONARIES_QUERY_KEYS.EXAM_TEMPLATE_STATUSES,
        getExamTemplateStatuses,
        {
            staleTime: DEFAULT_LOOKUP_STALE_TIME,
            select: queryData => toLookupList(queryData.data.data),
        }
    );

    const isLoading = useMemo(
        () => isExamTemplateStatusesLookupLoading || isKitTemplateStatusesLookupLoading,
        [isExamTemplateStatusesLookupLoading, isKitTemplateStatusesLookupLoading]
    );

    const [statusVariant, statusText]: [TableStatusVariant, string] = useMemo(() => {
        if (type === TemplateTypeEnum.EXAM) {
            switch (status) {
                case TemplateStatusEnum.ACTIVE:
                    return [
                        "success",
                        getLookupItem(examTemplateStatusesLookup, TemplateStatusEnum.ACTIVE)?.label || "",
                    ];
                case TemplateStatusEnum.INACTIVE:
                default:
                    return [
                        "neutral",
                        getLookupItem(examTemplateStatusesLookup, TemplateStatusEnum.INACTIVE)?.label || "",
                    ];
            }
        } else {
            switch (status) {
                case TemplateStatusEnum.ACTIVE:
                    return [
                        "success",
                        getLookupItem(kitTemplateStatusesLookup, TemplateStatusEnum.ACTIVE)?.label || "",
                    ];
                case TemplateStatusEnum.INACTIVE:
                default:
                    return [
                        "neutral",
                        getLookupItem(kitTemplateStatusesLookup, TemplateStatusEnum.INACTIVE)?.label || "",
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

export default memo(StatusCell);
