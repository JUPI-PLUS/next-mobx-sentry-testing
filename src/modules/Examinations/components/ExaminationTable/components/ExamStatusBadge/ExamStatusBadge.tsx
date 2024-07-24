// libs
import React from "react";
import { useQuery } from "react-query";

// api
import { getExamStatuses } from "../../../../../../api/dictionaries";

// helpers
import { getLookupItem, toLookupList } from "../../../../../../shared/utils/lookups";

// models
import { ExamStatusBadgeProps } from "./models";
import { ExamStatusesEnum } from "../../../../../../shared/models/business/exam";

// constants
import { DEFAULT_LOOKUP_STALE_TIME } from "../../../../../../shared/constants/queries";
import { DICTIONARIES_QUERY_KEYS } from "../../../../../../shared/constants/queryKeys";

// components
import Badge from "../../../../../../components/uiKit/Badge/Badge";

const getBadgeVariant = (statusId: number) => {
    switch (statusId) {
        case ExamStatusesEnum.BIOMATERIAL_RECEIVED:
            return "info";
        case ExamStatusesEnum.DONE:
            return "success";
        case ExamStatusesEnum.FAILED:
            return "error";
        case ExamStatusesEnum.NEW:
            return "neutral";
        case ExamStatusesEnum.IN_PROGRESS:
        default:
            return "warning";
    }
};

const ExamStatusBadge = ({ statusId }: ExamStatusBadgeProps) => {
    const { data: statusesLookup } = useQuery(DICTIONARIES_QUERY_KEYS.EXAM_STATUSES, getExamStatuses, {
        staleTime: DEFAULT_LOOKUP_STALE_TIME,
        select: queryData => toLookupList(queryData.data.data),
    });

    const badgeVariant = getBadgeVariant(statusId);
    const status = getLookupItem(statusesLookup, statusId)?.label;

    if (!status) return null;

    return <Badge text={status} variant={badgeVariant} data-testid="exam-status" />;
};

export default ExamStatusBadge;
