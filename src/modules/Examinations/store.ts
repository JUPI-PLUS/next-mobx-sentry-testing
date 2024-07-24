// libs
import { createContext, useContext } from "react";
import { action, computed, makeObservable, observable } from "mobx";
import { stringify } from "query-string";
import { QueryKey } from "react-query";
import set from "lodash/set";
import isEqual from "lodash/isEqual";
import get from "lodash/get";
import { computedFn } from "mobx-utils";

// helpers
import { getCalendarDefaultValue } from "../../components/uiKit/DatePickers/utils";
import { isValueInRange } from "../../components/uiKit/ProgressBar/Stacked/utils";
import { filterExamTemplatesByIds } from "./components/ExaminationTable/utils";
import { prepareSampleSorting } from "./utils";

// models
import { ID, SortingWay } from "../../shared/models/common";
import { ExaminationBySample, ParamFullDetail, PickedWorkplace, SampleFilters } from "./models";
import { ExaminationSample, ExamOfSample, ExamStatusesEnum } from "../../shared/models/business/exam";
import { SampleActionType } from "../../shared/models/business/sample";
import { Lookup } from "../../shared/models/form";
import { SortingFieldsType } from "../../shared/models/routing";

// constants
import { DEFAULT_SAMPLES_FILTER_VALUES, DEFAULT_SAMPLES_SORTING_VALUES } from "./constants";

class ExaminationStore {
    @observable public activeSample: ExaminationSample | null = null;
    @observable private _samplesFilters: SampleFilters = DEFAULT_SAMPLES_FILTER_VALUES;
    @observable private _samplesSorting: SortingFieldsType = DEFAULT_SAMPLES_SORTING_VALUES;
    @observable private _sortedExamsByStatus: Map<ExamStatusesEnum, Array<ExamOfSample>> = new Map();
    @observable private _selectedExamTemplatesStatuses: Lookup<ID>[] = [];
    @observable private _examinationTableData: ExaminationBySample[] = [];
    @observable public initialExaminationTableData: ExaminationBySample[] = [];
    @observable public lastRequestedQueryKey: QueryKey | null = null;
    @observable public isExaminationsCanBeSaved = false;
    @observable public isExaminationParametersDirty = false;
    @observable public isValidatedButtonDisabled = false;
    @observable public sampleActionType: SampleActionType | null = null;
    @observable public sampleTypesLookup: Lookup<ID>[] = [];
    @observable public examTemplatesLookup: Lookup<ID>[] = [];
    @observable public examTemplatesByWorkplaceLookup: Lookup<ID>[] = [];
    @observable public selectedWorkplace: PickedWorkplace | null = null;
    @observable public isWindowResizing = false;

    constructor() {
        makeObservable(this);
    }

    @action.bound
    setupExaminationTableData(examinationTableData: Array<ExaminationBySample>) {
        this._examinationTableData = examinationTableData;
    }

    @action.bound
    resetExaminationTableData() {
        this.setupExaminationTableData(this.initialExaminationTableData);
    }

    @action.bound
    setActiveSample(activeSample: ExaminationSample | null) {
        this.activeSample = activeSample;
        this._sortedExamsByStatus.clear();
        this.isExaminationParametersDirty = false;
        if (!activeSample) return;

        activeSample.exams?.forEach(exam => {
            const next = this._sortedExamsByStatus.has(exam.status)
                ? [...this._sortedExamsByStatus.get(exam.status)!, exam]
                : [exam];
            this._sortedExamsByStatus.set(exam.status, next);
        });
    }

    @action.bound
    setSampleFilterValue(name: keyof SampleFilters, value: string | number | Array<ID> | null) {
        switch (name) {
            case "expire_date_from":
            case "expire_date_to":
                this._samplesFilters[name] = value as number | null;
                return;
            case "type_id":
            case "exam_template_id":
                this._samplesFilters[name] = value as Array<ID>;
                return;
            default:
                this._samplesFilters[name] = value as string;
                return;
        }
    }

    @action.bound
    setupSamplesSorting(name: keyof SortingFieldsType, value: string | SortingWay) {
        switch (name) {
            case "order_way":
                this._samplesSorting[name] = value as SortingWay;
                return;
            default:
                this._samplesSorting[name] = value as string;
                return;
        }
    }

    @action.bound
    setupSampleActionType(type: SampleActionType) {
        this.sampleActionType = type;
    }

    @action.bound
    resetSampleActionType() {
        this.sampleActionType = null;
    }

    @action.bound
    resetActiveSample() {
        this.activeSample = null;
        this._sortedExamsByStatus.clear();
    }

    @action.bound
    resetSampleFilter() {
        this._samplesFilters = DEFAULT_SAMPLES_FILTER_VALUES;
    }

    @action.bound
    resetSampleSorting() {
        this._samplesSorting = DEFAULT_SAMPLES_SORTING_VALUES;
    }

    @action.bound
    setupExaminationValue(path: string, value: Array<string> | string) {
        set(this._examinationTableData, path, value || null);
    }

    @action.bound
    setupExamsTemplateStatuses(examTemplatesStatuses: Lookup<ID>[]) {
        this._selectedExamTemplatesStatuses = examTemplatesStatuses;
    }

    @action.bound
    setupParameterNotesOnResultValueChange(path: string, resultValue: string) {
        const parameterResultNotesPath = `${path}.result_notes`;
        if (resultValue.length) {
            const parameter = get(this._examinationTableData, path) as ParamFullDetail;
            const { note } =
                parameter?.reference_values?.find(({ from, to }) => isValueInRange(from, to, Number(resultValue))) ||
                {};

            set(this._examinationTableData, parameterResultNotesPath, note);
            return note;
        }

        set(this._examinationTableData, parameterResultNotesPath, "");
        return "";
    }

    @action.bound
    setupExaminationNotes(path: string, value: string) {
        set(this._examinationTableData, path, value);
    }

    @action.bound
    setupLastRequestedQueryKey(queryKey: QueryKey) {
        this.lastRequestedQueryKey = queryKey;
    }

    @action.bound
    cleanup() {
        this._examinationTableData = [];
        this.initialExaminationTableData = [];
        this.lastRequestedQueryKey = null;
        this.isExaminationsCanBeSaved = false;
        this.isExaminationParametersDirty = false;
        this.setupExamsTemplateStatuses([]);
    }

    @action.bound
    setupExaminationParameterDirty() {
        this.isExaminationParametersDirty = true;
    }

    @action.bound
    setupExaminationsCanBeValidated(flag: boolean) {
        this.isValidatedButtonDisabled = flag;
    }

    @action.bound
    setupExaminationResults(data: ExaminationBySample[], queryKey: QueryKey) {
        this.setupLastRequestedQueryKey(queryKey);
        this.initialExaminationTableData = data;

        return this.setupFilteredExaminationResults(data);
    }

    @action.bound
    setupFilteredExaminationResults(data: ExaminationBySample[]) {
        const examinations = filterExamTemplatesByIds(
            data,
            this.examTemplatesByWorkplaceLookup.map(({ value }) => value)
        );
        this.setupExaminationTableData(examinations);
        return examinations;
    }

    @action.bound
    setupSampleTypesLookup(lookup: Lookup<ID>[]) {
        this.sampleTypesLookup = lookup;
    }

    @action.bound
    setupExamTemplatesLookup(lookup: Lookup<ID>[]) {
        this.examTemplatesLookup = lookup;
    }

    @action.bound
    setupExamTemplatesByWorkplaceLookup(examTemplates: Lookup<ID>[]) {
        this.examTemplatesByWorkplaceLookup = examTemplates;
    }

    @action.bound
    setupPickedWorkplaceUUID(uuid: string | null, name: string | null = null) {
        if (!uuid || !name) {
            this.selectedWorkplace = null;
            return;
        }
        this.selectedWorkplace = {
            uuid,
            name,
        };
    }

    @action.bound
    setIsWindowResizing(value: boolean) {
        this.isWindowResizing = value;
    }

    getNotesByPath = computedFn((path: string) => get(this._examinationTableData, path));

    @computed
    get sampleFilters() {
        return this._samplesFilters;
    }

    @computed
    get sampleSorting() {
        return this._samplesSorting;
    }

    @computed
    get selectedExamTemplatesStatuses() {
        return this._selectedExamTemplatesStatuses.map(({ value }) => value);
    }

    @computed
    get selectedExamTemplatesStatusesLookup() {
        return this._selectedExamTemplatesStatuses;
    }

    @computed
    get allExamsStatuses() {
        return Array.from(this._sortedExamsByStatus.keys());
    }

    @computed
    get availableMarkAsDamageExamsStatuses() {
        return this.allExamsStatuses.filter(status => {
            switch (status) {
                case ExamStatusesEnum.DONE:
                case ExamStatusesEnum.ON_VALIDATION:
                case ExamStatusesEnum.FAILED:
                    return false;
                default:
                    return true;
            }
        });
    }

    @computed
    get availableMarkAsDamageExams() {
        return this.availableMarkAsDamageExamsStatuses.map(status => this._sortedExamsByStatus.get(status)!).flat();
    }

    @computed
    get failedExams() {
        return this._sortedExamsByStatus.get(ExamStatusesEnum.FAILED);
    }

    @computed
    get onValidationExams() {
        return this._sortedExamsByStatus.get(ExamStatusesEnum.ON_VALIDATION);
    }

    @computed
    get activeSampleFilters() {
        return {
            barcode: this.sampleFilters.barcode,
            exam_order_number: this.sampleFilters.exam_order_number,
            expired: getCalendarDefaultValue({
                from: this.sampleFilters.expire_date_from,
                to: this.sampleFilters.expire_date_to,
            }),
            type_id: this.sampleTypesLookup.filter(({ value }) => this.sampleFilters.type_id.includes(value)),
            exam_template_id: this.examTemplatesLookup.filter(({ value }) =>
                this.sampleFilters.exam_template_id.includes(value)
            ),
        };
    }

    @computed
    get samplesFiltersQueryString() {
        const sampleSorting = prepareSampleSorting(this._samplesSorting);
        return stringify(
            { ...this._samplesFilters, ...sampleSorting },
            {
                arrayFormat: "bracket",
                skipEmptyString: true,
                skipNull: true,
            }
        );
    }

    @computed
    get isSampleHiddenFiltersFilled() {
        const { barcode: filledBarcode, ...restFilledFilterValues } = this._samplesFilters;
        const { barcode: defaultBarcode, ...restDefaultFilterValues } = DEFAULT_SAMPLES_FILTER_VALUES;
        return !isEqual(restFilledFilterValues, restDefaultFilterValues);
    }

    @computed
    get isExaminationsCanBeValidated() {
        return this._examinationTableData.some(order =>
            order.exams.some(exam => exam.status_id === ExamStatusesEnum.ON_VALIDATION)
        );
    }

    @computed
    get examinationTableData() {
        if (this.selectedExamTemplatesStatuses.length === 0) return this._examinationTableData;

        return this._examinationTableData.reduce<ExaminationBySample[]>((accumulator, order) => {
            const modifiedOrder = { ...order };

            modifiedOrder.exams = modifiedOrder.exams.filter(({ status_id }) =>
                this.selectedExamTemplatesStatuses.includes(status_id)
            );

            if (modifiedOrder.exams.length > 0) {
                accumulator.push(modifiedOrder);
            }
            return accumulator;
        }, []);
    }
}

export const ExaminationStoreContext = createContext({
    examinationStore: new ExaminationStore(),
});

interface ExaminationStoreContextValue {
    examinationStore: ExaminationStore;
}

export const useExaminationStore = (): ExaminationStoreContextValue => useContext(ExaminationStoreContext);
