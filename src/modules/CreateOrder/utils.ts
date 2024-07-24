import { UrgencyStatus } from "../../shared/models/business/enums";
import {
    DEFAULT_ORDER_TEMPLATES_URGENCY_STATUS,
    ExamTemplateItem,
    ExamTemplateWithUrgency,
    TemplateItem,
} from "./models";

export const updateExamTemplateUrgency = <T>(map: Map<string, T>, urgencyStatus: UrgencyStatus) => {
    return new Map(
        Array.from(map, ([key, values]) => [
            key,
            Array.isArray(values)
                ? (values.map<T>(value => ({ ...value, urgencyStatus })) as T)
                : { ...values, urgencyStatus },
        ])
    );
};

export const isEveryExamTemplateHasPickedStatus = (
    urgencyStatus: UrgencyStatus,
    examTemplates?: Array<ExamTemplateItem>
) => {
    return examTemplates?.every(examTemplate => examTemplate.urgencyStatus === urgencyStatus);
};

export const getAccordionUrgencyStatusByExamTemplates = (examTemplates?: Array<TemplateItem>) => {
    if (!examTemplates?.length) return UrgencyStatus.NORMAL;

    if (examTemplates?.some(examTemplate => examTemplate.urgencyStatus === UrgencyStatus.EMERGENCY)) {
        return UrgencyStatus.EMERGENCY;
    }
    if (examTemplates?.some(examTemplate => examTemplate.urgencyStatus === UrgencyStatus.URGENT)) {
        return UrgencyStatus.URGENT;
    }

    return UrgencyStatus.NORMAL;
};

export const updateExamTemplatesStatuses = (examTemplates: Array<ExamTemplateItem>, urgencyStatus: UrgencyStatus) => {
    const isEveryExamTemplateAlreadyHasPickedStatus = isEveryExamTemplateHasPickedStatus(urgencyStatus, examTemplates);

    examTemplates.forEach(examTemplate => {
        examTemplate.urgencyStatus = isEveryExamTemplateAlreadyHasPickedStatus
            ? DEFAULT_ORDER_TEMPLATES_URGENCY_STATUS
            : urgencyStatus;
    });
    return examTemplates;
};

export const updateExamTemplateStatus = (
    examUUID: string,
    examTemplates: Array<ExamTemplateItem>,
    urgencyStatus: UrgencyStatus
) => {
    const foundExamTemplate = examTemplates.find(examTemplate => examTemplate.uuid === examUUID)!;
    foundExamTemplate.urgencyStatus =
        foundExamTemplate.urgencyStatus === urgencyStatus ? UrgencyStatus.NORMAL : urgencyStatus;

    return examTemplates;
};

export const getTransformedKitTemplates = (map: Map<string, ExamTemplateWithUrgency[]>) => {
    const selectedKitExamTemplates = Array.from(map);
    return selectedKitExamTemplates.map(([kitUUID, examTemplates]) => ({
        uuid: kitUUID,
        exam_templates: getTransformedExamTemplates(examTemplates),
    }));
};

export const getTransformedExamTemplates = (selectedExamTemplates: Array<ExamTemplateItem>) => {
    return selectedExamTemplates.map(({ uuid, urgencyStatus }) => ({
        uuid,
        urgency_id: urgencyStatus ?? DEFAULT_ORDER_TEMPLATES_URGENCY_STATUS,
    }));
};
