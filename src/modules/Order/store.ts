import { action, computed, makeObservable, observable } from "mobx";
import { createContext, useContext } from "react";
import { computedFn } from "mobx-utils";
import { OrderDetails, OrderExamDetails } from "./models";
import { ExamStatusesEnum } from "../../shared/models/business/exam";
import { IndeterminateCheckboxValues } from "../../components/uiKit/forms/Checkbox/models";
import { SampleActionType } from "../../shared/models/business/sample";
import { QueryKey } from "react-query/types/core/types";
import { Lookup } from "../../shared/models/form";
import { ID } from "../../shared/models/common";
import { Patient } from "../../shared/models/business/user";
import { getIsUserDeleted } from "../../shared/utils/user";

class OrderStore {
    @observable public orderDetails: OrderDetails | null = null;
    @observable public userData: Patient | null = null;
    @observable public isSingleItemAction = false;
    @observable public isSomeExamOnValidation = false;
    @observable public examSampleTypes: Lookup<ID>[] = [];
    @observable private _selectedExams: Map<string, OrderExamDetails> = new Map();
    @observable public groupedSelectedTemplates: Record<string, Array<OrderExamDetails>> | null = {};
    @observable public sampleActionType: SampleActionType | null = null;
    @observable public lastRequestedOrdersQueryKey: QueryKey | undefined = undefined;

    constructor() {
        makeObservable(this);
    }

    @action.bound
    resetOrderExams() {
        this._selectedExams = new Map<string, OrderExamDetails>();
    }

    @action.bound
    setupOrderExams(exams: OrderExamDetails[]) {
        const firstExamWithStatusUndoneIndex = exams.findIndex(exam => exam.exam_status !== ExamStatusesEnum.DONE);
        const start = exams.slice(0, firstExamWithStatusUndoneIndex);
        const end = exams.slice(firstExamWithStatusUndoneIndex + 1);
        const restExams = [...start, ...end];
        const pickedExam = exams[firstExamWithStatusUndoneIndex];
        this._selectedExams.set(pickedExam.exam_uuid, pickedExam);
        for (const exam of restExams) {
            if (
                exam.exam_status === pickedExam.exam_status &&
                exam.sample_type === pickedExam.sample_type &&
                exam.sample_num === pickedExam.sample_num
            ) {
                this._selectedExams.set(exam.exam_uuid, exam);
            }
        }
    }

    @action.bound
    setupOrderExam(exam: OrderExamDetails) {
        this._selectedExams.set(exam.exam_uuid, exam);
    }

    @action.bound
    setupGroupedSelectedTemplates(templates: Record<string, Array<OrderExamDetails>>) {
        this.groupedSelectedTemplates = templates;
    }

    @action.bound
    removeOrderExam(examUUID: string) {
        this._selectedExams.delete(examUUID);
    }

    @action.bound
    setupSampleActionType(type: SampleActionType) {
        this.sampleActionType = type;
    }

    @action.bound
    setupIsSingleItemAction(isSingleItemAction: boolean) {
        this.isSingleItemAction = isSingleItemAction;
    }

    @action.bound
    setupIsSomeExamOnValidation(isSomeExamOnValidation: boolean) {
        this.isSomeExamOnValidation = isSomeExamOnValidation;
    }

    @action.bound
    setupExamSampleTypes(lookup: Lookup<ID>[]) {
        this.examSampleTypes = lookup;
    }

    @action.bound
    setupLastRequestedQueryKey(queryKey: QueryKey) {
        this.lastRequestedOrdersQueryKey = queryKey;
    }

    @action.bound
    setupOrderDetails(order: OrderDetails) {
        this.orderDetails = order;
    }

    @action.bound
    setupUserData(user: Patient) {
        this.userData = user;
    }

    @action.bound
    resetLastRequestedQueryKey() {
        this.lastRequestedOrdersQueryKey = undefined;
    }

    @action.bound
    resetSampleActionType() {
        this.sampleActionType = null;
    }

    @action.bound
    resetIsSingleItemAction() {
        this.isSingleItemAction = false;
    }

    @action.bound
    cleanup() {
        this.isSomeExamOnValidation = false;
        this.isSingleItemAction = false;
        this._selectedExams = new Map();
        this.sampleActionType = null;
        this.orderDetails = null;
        this.userData = null;
    }

    @computed get isUserDeleted() {
        return getIsUserDeleted(this.userData);
    }

    @computed
    get selectedExams() {
        return this._selectedExams;
    }

    @computed
    get oneOfSelectedExam() {
        return Array.from(this._selectedExams.values())[0];
    }

    @computed
    get examinationDetailsBasedOnAction() {
        return Array.from(this._selectedExams.values());
    }

    selectAllExamsValue = computedFn((exams: OrderExamDetails[]) => {
        if (this.isSingleItemAction) return IndeterminateCheckboxValues.Empty;

        const isSampleNameSame = exams.some(
            ({ exam_uuid, exam_name }) => exam_name === this._selectedExams.get(exam_uuid)?.exam_name
        );
        if (!isSampleNameSame) return IndeterminateCheckboxValues.Empty;

        return exams.length === this._selectedExams.size
            ? IndeterminateCheckboxValues.Checked
            : IndeterminateCheckboxValues.Indeterminate;
    });

    isSelectAllExamsDisabled = computedFn((exams: OrderExamDetails[], sampleType: number) => {
        if (this.isSingleItemAction) return true;

        const isSomeExamsInProgress = exams.some(
            ({ exam_status }) => exam_status !== ExamStatusesEnum.DONE && exam_status !== ExamStatusesEnum.ON_VALIDATION
        );

        if (!isSomeExamsInProgress) return true;

        return (
            Boolean(this._selectedExams.size) &&
            Boolean(Array.from(this._selectedExams).find(([, exam]) => exam.sample_type !== sampleType))
        );
    });

    isExamCheckboxDisabled = computedFn((exam: OrderExamDetails) => {
        if (this.isSingleItemAction) return true;
        if (exam.exam_status === ExamStatusesEnum.DONE || exam.exam_status === ExamStatusesEnum.ON_VALIDATION)
            return true;

        if (!this._selectedExams.size) return false;

        return !Array.from(this._selectedExams).some(([, storedExam]) => {
            return (
                storedExam.exam_status === exam.exam_status &&
                storedExam.sample_type === exam.sample_type &&
                storedExam.sample_num === exam.sample_num
            );
        });
    });
}

export const OrderStoreContext = createContext({
    orderStore: new OrderStore(),
});

interface OrderStoreContextValue {
    orderStore: OrderStore;
}

export const useOrderStore = (): OrderStoreContextValue => useContext(OrderStoreContext);
