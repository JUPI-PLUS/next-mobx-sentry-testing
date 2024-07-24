import {
    OrderExaminationGroupRow,
    OrderExaminationRow,
    OrderExaminationRowTypeEnum,
    OrderExaminationTableRow,
} from "./models";
import { OrderExamDetails, OrderExamDetailsWithStatus } from "../../models";
import { Lookup } from "../../../../shared/models/form";
import { ID } from "../../../../shared/models/common";
import { Row } from "@tanstack/react-table";
import { groupBy } from "lodash";
import { getLookupItem } from "../../../../shared/utils/lookups";

export const groupSamplesById = (
    exams: OrderExamDetails[] | undefined,
    examTypes: Lookup<ID>[],
    examStatuses: Lookup<ID>[]
) => {
    const result: Record<string, OrderExamDetailsWithStatus[]> = {};
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const group: Record<string, OrderExamDetailsWithStatus[]> = groupBy<OrderExamDetails>(exams, "sample_type");

    for (const groupKey in group) {
        const groupByExamTypeLabel = getLookupItem(examTypes, Number(groupKey))?.label;
        if (!groupByExamTypeLabel) continue;
        result[groupByExamTypeLabel] = group[groupKey].map(it => ({
            ...it,
            exam_status_text: getLookupItem(examStatuses, it.exam_status)!.label,
        }));
    }

    return result;
};

export const prepareOrderExaminationsResponse = (
    orderExaminations: OrderExamDetails[],
    sampleTypesLookup: Lookup<ID>[],
    examStatusesLookup: Lookup<ID>[]
) => {
    const groupedBySampleType = groupSamplesById(orderExaminations, sampleTypesLookup, examStatusesLookup);

    return Object.entries(groupedBySampleType).reduce<OrderExaminationTableRow[]>(
        (acc, [group, exams]) => [
            ...acc,
            { sampleName: group, type: OrderExaminationRowTypeEnum.GROUP, exams } as OrderExaminationGroupRow,
            ...(exams.map(exam => ({
                ...exam,
                sampleName: group,
                type: OrderExaminationRowTypeEnum.EXAM,
            })) as OrderExaminationRow[]),
        ],
        []
    );
};

export const tableRowClassName = (row: Row<OrderExaminationTableRow>) => {
    if (row.original.type === OrderExaminationRowTypeEnum.GROUP) {
        return "bg-dark-100";
    }

    return "";
};
