import { action, computed, makeObservable, observable } from "mobx";
import { createContext, useContext } from "react";
import { Lookup } from "../../shared/models/form";
import { ID } from "../../shared/models/common";
import { stringify } from "query-string";
import { Patient, Sex } from "../../shared/models/business/user";
import { getPatientAge } from "../../shared/utils/date";
import {
    CreateOrderStepsEnum,
    ExamTemplateWithUrgency,
    ExaminationTemplateWithUrgency,
    HiddenConditions,
    KitTemplateWithUrgency,
    OrderConditionResponse,
    SecondStepFormValuesType,
    TemplatesFilters,
    hiddenConditionsArray,
} from "./models";
import {
    updateExamTemplatesStatuses,
    updateExamTemplateStatus,
    getTransformedKitTemplates,
    getTransformedExamTemplates,
    updateExamTemplateUrgency,
} from "./utils";
import { UrgencyStatus } from "../../shared/models/business/enums";

const DEFAULT_TEMPLATES_FILTERS: TemplatesFilters = {
    name: "",
    status: null,
};

export const SECOND_STEP_FORM_VALUES: SecondStepFormValuesType = { referral_doctor: "", referral_notes: "" };

export class CreateOrderStore {
    @observable public createdOrderUUID = "";
    @observable public selectedKitsUUID: Set<string> = new Set();
    @observable public selectedExamTemplatesUUID: Set<string> = new Set();
    @observable public selectedKitTemplates: Map<string, KitTemplateWithUrgency> = new Map();
    @observable private _cachedKitTemplates: Map<string, KitTemplateWithUrgency> = new Map();
    @observable public selectedKitExamTemplates: Map<string, Array<ExamTemplateWithUrgency>> = new Map();
    @observable private _cachedKitExamTemplates: Map<string, Array<ExamTemplateWithUrgency>> = new Map();
    @observable public selectedExamTemplates: Map<string, ExaminationTemplateWithUrgency> = new Map();
    @observable private _cachedExamTemplates: Map<string, ExaminationTemplateWithUrgency> = new Map();

    @observable public isConditionsFetching = false;
    @observable public isSelectedExamsFetching = false;
    @observable public conditions: Array<OrderConditionResponse> = [];
    @observable private _conditionsValues: Record<string, unknown> = {};

    @observable public activeStep: CreateOrderStepsEnum = 0;
    @observable private _templatesFilters = DEFAULT_TEMPLATES_FILTERS;
    @observable private _orderPatient: Patient | null = null;
    @observable private _userUUID = "";
    @observable private _secondStepFormValues = SECOND_STEP_FORM_VALUES;
    @observable public parentGroupUUID: string | null = null; //null it's root parentGroupUuid
    @observable public currentGroupUUID = "";

    constructor() {
        makeObservable(this);
    }

    @action.bound
    setupOrderPatient(patient: Patient) {
        this._orderPatient = patient;
    }

    @action.bound
    setupCreatedOrderUUID(uuid: string) {
        this.createdOrderUUID = uuid;
    }

    @action.bound
    setupSecondStepFormValues(values: SecondStepFormValuesType) {
        const secondStepFormValuesClone = Object.assign({}, values);
        // TODO! Reconsider after a BE task LIMS-1186
        this.conditions.forEach(
            condition => (secondStepFormValuesClone[condition.name] = secondStepFormValuesClone[condition.name])
        );

        this._conditionsValues = secondStepFormValuesClone;
        this._secondStepFormValues = secondStepFormValuesClone;
    }

    @action.bound
    setupAdditionalOrderInformation(name: string, value: string) {
        this._secondStepFormValues[name] = value;
    }

    @action.bound
    setupParentGroupUUID(uuid: string | null) {
        this.parentGroupUUID = uuid;
    }

    @action.bound
    setupCurrentGroupUUID(uuid: string) {
        this.currentGroupUUID = uuid;
    }

    @action.bound
    cleanupParentGroupUUID() {
        this.parentGroupUUID = null;
    }

    @action.bound
    setupConditionsValues(values: Record<string, Lookup<ID> | null>) {
        this._conditionsValues = { ...this._conditionsValues, ...values };
        this._secondStepFormValues = { ...this._secondStepFormValues, ...values };
    }

    @action.bound
    resetConditionsValues() {
        this._conditionsValues = {};
    }

    @action.bound
    setupUserUUID(uuid = "") {
        this._userUUID = uuid;
    }

    @action.bound
    setupTemplateFilters(name: keyof TemplatesFilters, value: string) {
        switch (name) {
            case "name":
                this._templatesFilters[name] = value;
                break;
        }
    }

    @action.bound
    resetTemplatesFilters() {
        this._templatesFilters = DEFAULT_TEMPLATES_FILTERS;
    }

    @action.bound
    setActiveStep(index: number) {
        this.activeStep = index;
    }

    @action.bound
    makeStepForward() {
        if (this.activeStep < CreateOrderStepsEnum.ADDITIONAL_INFO) {
            this.activeStep += 1;
        }
    }

    @action.bound
    makeStepBack() {
        this.activeStep -= 1;
    }

    @action.bound
    setupKitTemplate(uuid: string, template: KitTemplateWithUrgency) {
        this.selectedKitTemplates.set(uuid, template);
        this._cachedKitTemplates.set(uuid, template);
    }

    @action.bound
    setupSelectedKit(uuid: string) {
        this.selectedKitsUUID.add(uuid);
        if (this._cachedKitTemplates.has(uuid)) {
            this.selectedKitTemplates.set(uuid, this._cachedKitTemplates.get(uuid)!);
        }
        if (this._cachedKitExamTemplates.has(uuid)) {
            this.selectedKitExamTemplates.set(uuid, this._cachedKitExamTemplates.get(uuid)!);
        }
    }

    @action.bound
    updateKitTemplate(uuid: string, urgencyStatus: UrgencyStatus) {
        const kitExamTemplates = Array.from(this.selectedKitExamTemplates.get(uuid)!.values());
        const kitExamTemplatesWithStatus = updateExamTemplatesStatuses(
            kitExamTemplates,
            urgencyStatus
        ) as Array<ExamTemplateWithUrgency>;

        this.selectedKitExamTemplates.set(uuid, kitExamTemplatesWithStatus);
        this._cachedKitExamTemplates.set(uuid, kitExamTemplatesWithStatus);
    }

    @action.bound
    removeKit(uuid: string) {
        this.selectedKitsUUID.delete(uuid);
        this.selectedKitTemplates.delete(uuid);
        this.selectedKitExamTemplates.delete(uuid);
    }

    @action.bound
    setupExamTemplate(examUUID: string, examTemplate: ExaminationTemplateWithUrgency) {
        this.selectedExamTemplates.set(examUUID, examTemplate);
        this._cachedExamTemplates.set(examUUID, examTemplate);
    }

    @action.bound
    setupSelectedExamTemplate(uuid: string) {
        this.selectedExamTemplatesUUID.add(uuid);
        if (this._cachedExamTemplates.has(uuid)) {
            this.selectedExamTemplates.set(uuid, this._cachedExamTemplates.get(uuid)!);
        }
    }

    @action.bound
    removeExamTemplate(uuid: string) {
        this.selectedExamTemplatesUUID.delete(uuid);
        this.selectedExamTemplates.delete(uuid);
    }

    @action.bound
    setupKitExamTemplates(uuid: string, templates: Array<ExamTemplateWithUrgency>) {
        this.selectedKitExamTemplates.set(uuid, templates);
        this._cachedKitExamTemplates.set(uuid, templates);
    }

    @action.bound
    updateKitExamTemplate(kitUUID: string, examUUID: string, urgencyStatus: UrgencyStatus) {
        const kitExamTemplates = this.selectedKitExamTemplates.get(kitUUID)!;
        const updatedKit = updateExamTemplateStatus(
            examUUID,
            kitExamTemplates,
            urgencyStatus
        ) as Array<ExamTemplateWithUrgency>;

        this.selectedKitExamTemplates.set(kitUUID, updatedKit);
        this._cachedKitExamTemplates.set(kitUUID, updatedKit);
    }

    @action.bound
    updateExamTemplates(urgencyStatus: UrgencyStatus) {
        const copyOfExamTemplates: typeof this.selectedExamTemplates = new Map();

        const selectedExamTemplates = Array.from(this.selectedExamTemplates.values());
        const selectedExamTemplatesWithStatuses = updateExamTemplatesStatuses(
            selectedExamTemplates,
            urgencyStatus
        ) as Array<ExaminationTemplateWithUrgency>;

        selectedExamTemplatesWithStatuses.forEach((examTemplate, index) => {
            return copyOfExamTemplates.set(examTemplate.uuid, selectedExamTemplatesWithStatuses[index]);
        });

        this.selectedExamTemplates = copyOfExamTemplates;
    }

    @action.bound
    updateExamTemplate(uuid: string, urgencyStatus: UrgencyStatus) {
        const examTemplateByUUID = this.selectedExamTemplates.get(uuid);
        if (!examTemplateByUUID) return;

        const updatedExamTemplate = updateExamTemplatesStatuses(
            [examTemplateByUUID],
            urgencyStatus
        )[0] as ExaminationTemplateWithUrgency;

        this.selectedExamTemplates.set(uuid, updatedExamTemplate);
        this._cachedExamTemplates.set(uuid, updatedExamTemplate);
    }

    @action.bound
    changeOrderUrgencyStatus(urgencyStatus: UrgencyStatus) {
        const isSomeKitExamTemplatesDifferentUrgencyStatus = Array.from(this.selectedKitExamTemplates.values())
            .flat()
            .some(({ urgencyStatus: kitExamUrgencyStatus }) => kitExamUrgencyStatus !== urgencyStatus);

        let shouldSetNormalUrgencyStatus = !isSomeKitExamTemplatesDifferentUrgencyStatus;

        if (this.selectedExamTemplates.size) {
            const isSomeExamTemplatesDifferentUrgencyStatus = Array.from(this.selectedExamTemplates.values())
                .flat()
                .some(({ urgencyStatus: examUrgencyStatus }) => examUrgencyStatus !== urgencyStatus);

            shouldSetNormalUrgencyStatus =
                !isSomeKitExamTemplatesDifferentUrgencyStatus && !isSomeExamTemplatesDifferentUrgencyStatus;

            this.selectedExamTemplates = updateExamTemplateUrgency<ExaminationTemplateWithUrgency>(
                this.selectedExamTemplates,
                shouldSetNormalUrgencyStatus ? UrgencyStatus.NORMAL : urgencyStatus
            );

            this._cachedExamTemplates = this.selectedExamTemplates;
        }

        this.selectedKitExamTemplates = updateExamTemplateUrgency<ExamTemplateWithUrgency[]>(
            this.selectedKitExamTemplates,
            shouldSetNormalUrgencyStatus ? UrgencyStatus.NORMAL : urgencyStatus
        );

        this._cachedKitExamTemplates = this.selectedKitExamTemplates;
    }

    @action.bound
    setupConditions(conditions: Array<OrderConditionResponse>) {
        this.conditions = conditions;
    }

    @action.bound
    setupIsConditionsFetching(flag: boolean) {
        this.isConditionsFetching = flag;
    }

    @action.bound
    setupIsSelectedTemplatesFetching(flag: boolean) {
        this.isSelectedExamsFetching = flag;
    }

    @action.bound
    resetSelectedTemplates() {
        this.selectedKitsUUID = new Set();
        this.selectedExamTemplatesUUID = new Set();
        this.selectedKitTemplates = new Map();
        this.selectedKitExamTemplates = new Map();
        this.selectedExamTemplates = new Map();
    }

    @action.bound
    cleanup() {
        this.selectedKitsUUID = new Set();
        this.selectedExamTemplatesUUID = new Set();
        this._cachedKitTemplates = new Map();
        this._cachedKitExamTemplates = new Map();
        this._cachedExamTemplates = new Map();
        this.selectedKitTemplates = new Map();
        this.selectedKitExamTemplates = new Map();
        this.selectedExamTemplates = new Map();
        this.createdOrderUUID = "";
        this.activeStep = 0;
        this.parentGroupUUID = "";
        this.currentGroupUUID = "";
        this._templatesFilters = DEFAULT_TEMPLATES_FILTERS;
        this._orderPatient = null;
        this._userUUID = "";
        this._secondStepFormValues = SECOND_STEP_FORM_VALUES;
    }

    @computed
    get conditionsValues() {
        return this._conditionsValues;
    }

    @computed
    get filteredConditions() {
        return this.conditions.filter(cond => !hiddenConditionsArray.includes(cond.id));
    }

    @computed
    get patientConditions() {
        return this.conditions.map(condition => {
            // filling hidden conditions
            switch (condition.id) {
                case HiddenConditions.SEX:
                    return {
                        type_id: condition.id,
                        operator: condition.operator,
                        value: this._orderPatient?.sex_id ?? Sex.UNKNOWN,
                    };
                case HiddenConditions.AGE_YEARS:
                case HiddenConditions.AGE_DAYS:
                    return {
                        type_id: condition.id,
                        operator: condition.operator,
                        value: getPatientAge(
                            this._orderPatient?.birth_date ?? 0,
                            condition.id === HiddenConditions.AGE_DAYS ? "days" : "years"
                        ),
                    };
            }

            // filling other (visible) conditions
            return {
                type_id: condition.id,
                operator: condition.operator,
                value:
                    typeof this._conditionsValues[condition.name] === "number"
                        ? (this._conditionsValues[condition.name] as number)
                        : (this._conditionsValues[condition.name] as Lookup<number>)?.value,
            };
        });
    }

    @computed
    get isConditionsRequired() {
        return Boolean(this.conditions.length);
    }

    @computed
    get orderPatient() {
        return this._orderPatient;
    }

    @computed
    get secondStepFormValues() {
        return this._secondStepFormValues;
    }

    @computed
    get getAllSelectedExamTemplates() {
        return [
            ...Array.from(this.selectedKitExamTemplates.values()).flat(),
            ...Array.from(this.selectedExamTemplates.values()).flat(),
        ];
    }

    @computed
    get getAllSelectedExamTemplatesUUIDs() {
        return this.getAllSelectedExamTemplates.map(exam => exam.uuid);
    }

    @computed
    get templatesFiltersQueryString() {
        return stringify(this._templatesFilters, { skipEmptyString: true, skipNull: true });
    }

    @computed
    get getTemplatesQuery() {
        if (!this.templatesFiltersQueryString && this.currentGroupUUID !== null) {
            return stringify(
                { group_uuid: this.currentGroupUUID || this.parentGroupUUID },
                {
                    skipEmptyString: true,
                    skipNull: true,
                }
            );
        }
        return this.templatesFiltersQueryString;
    }

    @computed
    get createOrderMutationBody() {
        return {
            kit_templates: getTransformedKitTemplates(this.selectedKitExamTemplates),
            exam_templates: getTransformedExamTemplates(Array.from(this.selectedExamTemplates.values())),
            user_uuid: this._userUUID,
            referral_doctor: this._secondStepFormValues.referral_doctor as string,
            referral_notes: this._secondStepFormValues.referral_notes as string,
        };
    }

    @computed
    get updateOrderConditionsMutationBody() {
        return {
            conditions: this.patientConditions,
            uuid: this.createdOrderUUID,
        };
    }

    @computed
    get templatesFilters() {
        return this._templatesFilters;
    }

    @computed
    get userUUID() {
        return this._userUUID;
    }

    @computed
    get isKitOrExamSelected() {
        return Boolean(this.selectedKitTemplates.size || this.selectedExamTemplates.size);
    }

    @computed get avatar() {
        return this._orderPatient?.profile_photo ?? "";
    }

    isKitCached = (uuid: string) => {
        return this._cachedKitTemplates.has(uuid);
    };

    isKitExamsCached = (kitUUID: string) => {
        return this._cachedKitExamTemplates.has(kitUUID);
    };

    isExamCached = (uuid: string) => {
        return this._cachedExamTemplates.has(uuid);
    };
}

export const CreateOrderStoreContext = createContext({
    createOrderStore: new CreateOrderStore(),
});

interface CreateOrderStoreContextValue {
    createOrderStore: CreateOrderStore;
}

export const useCreateOrderStore = (): CreateOrderStoreContextValue => useContext(CreateOrderStoreContext);
