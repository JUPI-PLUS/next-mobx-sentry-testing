// helpers
import { getGroupedConditionsByType, getInitialAgeCondition } from "../Examinations/components/ExaminationTable/utils";

// models
import { ExamFullDetail, ExaminationBySample, OrdersConditionBySample } from "../Examinations/models";
import { ExamStatusesEnum } from "../../shared/models/business/exam";

export const getPreviewOrdersConditions = (
    ordersConditionsBySample?: OrdersConditionBySample[]
): OrdersConditionBySample[] => {
    if (!ordersConditionsBySample) return [];
    const { filteredConditions, ageConditions, sexConditions } = getGroupedConditionsByType(ordersConditionsBySample);

    let ordersConditions = filteredConditions;

    const ageCondition = getInitialAgeCondition(ageConditions);
    if (ageCondition) {
        ordersConditions = [ageCondition, ...ordersConditions];
    }

    const sexCondition = sexConditions[0];
    if (sexCondition) {
        ordersConditions = [sexCondition, ...ordersConditions];
    }

    return ordersConditions;
};

export const getConcatenatedExams = (orders: ExaminationBySample[]) =>
    orders.reduce<ExamFullDetail[]>((acc, order) => [...acc, ...order.exams], []);

export const getGroupedExamsByStatus = (exams: ExamFullDetail[]) =>
    exams.reduce<{
        progressExams: ExamFullDetail[];
        doneExams: ExamFullDetail[];
    }>(
        (acc, exam) => {
            switch (exam.status_id) {
                case ExamStatusesEnum.DONE:
                    acc.doneExams.push(exam);
                    return acc;
                default:
                    acc.progressExams.push(exam);
                    return acc;
            }
        },
        { progressExams: [], doneExams: [] }
    );
