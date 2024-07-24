// libs
import { mixed, string } from "yup";

// helpers
import { getLookupItem, getLookupItems, toLookupList } from "../../shared/utils/lookups";
import { trimRichTextSpaces } from "../../shared/utils/string";

// models
import { ExamFullDetail, ExaminationBySample, FilteredExams, SortingByValues } from "./models";
import { ExaminationSample, ExamStatusesEnum } from "../../shared/models/business/exam";
import { ParameterViewTypeEnum, UrgencyStatus } from "../../shared/models/business/enums";
import { ID, SortingWay } from "../../shared/models/common";
import { Lookup } from "../../shared/models/form";
import { SortingFieldsType } from "../../shared/models/routing";

// constants
import { VALIDATION_MESSAGES } from "../../shared/validation/messages";
import { FORM_PROPERTY_PATH_SEPARATOR, PROPERTY_PATH_SEPARATOR } from "./constants";

export const transformPathToSchemaPath = (path: string) =>
    path.replaceAll(PROPERTY_PATH_SEPARATOR, FORM_PROPERTY_PATH_SEPARATOR);

export const getFormContainerSchemaProps = (orders: ExaminationBySample[]) => {
    return orders.reduce((ordersAcc, order, orderIndex) => {
        const exams = order.exams.reduce((examsAcc, exam, examIndex) => {
            const baseSchemaExamPath = [orderIndex, "exams", examIndex].join(FORM_PROPERTY_PATH_SEPARATOR);

            const params = exam.params.reduce((acc, param, paramIndex) => {
                let paramSchema;
                switch (param.type_view_id) {
                    case ParameterViewTypeEnum.DROPDOWN_STRICT:
                    case ParameterViewTypeEnum.DROPDOWN_MULTISELECT:
                    case ParameterViewTypeEnum.DROPDOWN_UNSTRICT:
                        paramSchema = mixed().nullable();
                        break;
                    default:
                        paramSchema = string().max(45, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS("Parameter", 45));
                        break;
                }
                return {
                    ...acc,
                    [[baseSchemaExamPath, "params", paramIndex, "value"].join(FORM_PROPERTY_PATH_SEPARATOR)]:
                        paramSchema,
                    [[baseSchemaExamPath, "params", paramIndex, "result_notes"].join(FORM_PROPERTY_PATH_SEPARATOR)]:
                        string()
                            .transform(trimRichTextSpaces)
                            .richTextMax(3000, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS("Notes", 3000)),
                };
            }, {});

            return {
                ...examsAcc,
                ...params,
                [[baseSchemaExamPath, "notes"].join(FORM_PROPERTY_PATH_SEPARATOR)]: string()
                    .transform(trimRichTextSpaces)
                    .richTextMax(10000, VALIDATION_MESSAGES.MAX_LENGTH_SYMBOLS("Conclusion", 10000)),
            };
        }, {});
        return { ...ordersAcc, ...exams };
    }, {});
};

export const getFormContainerDefaultValuesProps = (orders: ExaminationBySample[]) => {
    return orders.reduce((ordersAcc, order, orderIndex) => {
        const exams = order.exams.reduce((examsAcc, exam, examIndex) => {
            const baseSchemaExamPath = [orderIndex, "exams", examIndex].join(FORM_PROPERTY_PATH_SEPARATOR);

            const params = exam.params.reduce((acc, param, paramIndex) => {
                let value: string | Array<string> | null | Lookup<ID> | Array<Lookup<ID>> = param.value || "";
                switch (param.type_view_id) {
                    case ParameterViewTypeEnum.DROPDOWN_MULTISELECT:
                        value = getLookupItems(toLookupList(param.options), value.split(";"), "label");
                        break;
                    case ParameterViewTypeEnum.DROPDOWN_STRICT:
                        value = getLookupItem(toLookupList(param.options), value, "label");
                        break;
                    case ParameterViewTypeEnum.DROPDOWN_UNSTRICT:
                        const foundLookupItem = getLookupItem(toLookupList(param.options), value, "label");
                        value = foundLookupItem || { value, label: value };
                        break;
                }
                return {
                    ...acc,
                    [[baseSchemaExamPath, "params", paramIndex, "value"].join(FORM_PROPERTY_PATH_SEPARATOR)]: value,
                    [[baseSchemaExamPath, "params", paramIndex, "result_notes"].join(FORM_PROPERTY_PATH_SEPARATOR)]:
                        param.result_notes || "",
                };
            }, {});

            return {
                ...examsAcc,
                ...params,
                [[baseSchemaExamPath, "notes"].join(FORM_PROPERTY_PATH_SEPARATOR)]: exam.notes || "",
            };
        }, {});
        return { ...ordersAcc, ...exams };
    }, {});
};

export const prepareExaminationsResultToSave = (examinations: ExaminationBySample[]) => {
    return examinations.reduce<ExaminationBySample[]>((ordersAcc, order) => {
        const orderExams = order.exams.reduce<ExamFullDetail[]>((examsAcc, exam) => {
            if (exam.status_id !== ExamStatusesEnum.DONE) {
                return [...examsAcc, exam];
            }

            return examsAcc;
        }, []);

        if (orderExams.length) {
            return [...ordersAcc, { ...order, uuid: order.order_uuid, exams: orderExams }];
        }

        return ordersAcc;
    }, []);
};

export const prepareExaminationsResultToValidate = (examinations: ExaminationBySample[], sampleUUID: string) => {
    return examinations.reduce<FilteredExams>(
        (orderAccumulator, order) => {
            const exams = order.exams.reduce<{ uuid: string }[]>((acc, exam) => {
                if (exam.status_id === ExamStatusesEnum.ON_VALIDATION) {
                    return [...acc, { uuid: exam.uuid }];
                }
                return acc;
            }, []);
            if (exams.length) {
                return {
                    ...orderAccumulator,
                    orders: [...orderAccumulator.orders, { uuid: order.order_uuid, exams }],
                };
            }
            return orderAccumulator;
        },
        {
            sample_uuid: sampleUUID,
            orders: [],
        }
    );
};

export const prepareSampleSorting = (sampleSorting: SortingFieldsType) => {
    switch (sampleSorting.order_by) {
        case SortingByValues.URGENCY:
            return {
                ...sampleSorting,
                order_by: SortingByValues.EXPIRE_DATE,
            };
        default:
            return sampleSorting;
    }
};

const isSampleEmergency = (sample: ExaminationSample) =>
    sample.exams.some(({ urgency_id }) => urgency_id === UrgencyStatus.EMERGENCY) ? UrgencyStatus.EMERGENCY : false;

const isSampleUrgent = (sample: ExaminationSample) =>
    sample.exams.some(({ urgency_id }) => urgency_id === UrgencyStatus.URGENT) ? UrgencyStatus.URGENT : false;

const getSampleUrgentStatus = (sample: ExaminationSample) =>
    isSampleEmergency(sample) || isSampleUrgent(sample) || UrgencyStatus.NORMAL;

export const prepareExaminationsListOfSamples = (
    sampleSorting: SortingFieldsType,
    listOfSamples?: ExaminationSample[]
) => {
    if (!listOfSamples) return [];
    if (sampleSorting.order_by !== SortingByValues.URGENCY) return listOfSamples;

    const sampleListWithUrgencyStatus = listOfSamples.map(sample => ({
        urgency: getSampleUrgentStatus(sample),
        ...sample,
    }));

    return sampleListWithUrgencyStatus.sort((prev, next) =>
        sampleSorting.order_way !== SortingWay.DESC ? next.urgency - prev.urgency : prev.urgency - next.urgency
    );
};
