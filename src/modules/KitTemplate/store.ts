import { action, computed, makeObservable, observable } from "mobx";
import { createContext, useContext } from "react";
import { ExamTemplate } from "../../shared/models/business/exam";
import { ID } from "../../shared/models/common";
import { Lookup } from "../../shared/models/form";
import { ExamTemplateError } from "./utils";

type Statuses = Array<Lookup<ID>>;

export class KitTemplateStore {
    @observable public selectedExamTemplates: Array<ExamTemplate> = [];
    @observable public kitTemplateStatusesLookup: Statuses = [];
    @observable public examTemplateStatusesLookup: Statuses = [];
    @observable public examTemplateErrors: Array<ExamTemplateError> = [];
    @observable public currentKitTemplateUUID = "";

    constructor() {
        makeObservable(this);
    }

    @computed
    get isEditPage() {
        return Boolean(this.currentKitTemplateUUID);
    }

    @action.bound
    setupKitTemplateStatusesLookup(statuses: Statuses) {
        this.kitTemplateStatusesLookup = statuses;
    }

    @action.bound
    setupExamTemplateStatusesLookup(statuses: Statuses) {
        this.examTemplateStatusesLookup = statuses;
    }

    @action.bound
    setupExamTemplateErrors(errors: Array<ExamTemplateError>) {
        this.examTemplateErrors = errors;
    }

    @action.bound
    removeExamTemplateErrors(index: number) {
        const newArray = this.examTemplateErrors.filter((temp, curIndex) => curIndex !== index);
        this.examTemplateErrors = newArray;
    }

    @action.bound
    setupSelectedExamTemplates(newExamTemplates: Array<ExamTemplate>) {
        this.selectedExamTemplates = newExamTemplates;
    }

    @action.bound
    addSelectedExamTemplates(examTemplates: ExamTemplate[]) {
        this.selectedExamTemplates = [...this.selectedExamTemplates, ...examTemplates];
    }

    @action.bound
    removeExamTemplate(index: number) {
        const newArray = this.selectedExamTemplates.filter((temp, curIndex) => curIndex !== index);
        this.selectedExamTemplates = newArray;
    }

    @action.bound
    setupCurrentKitTemplateUUID(uuid: string) {
        this.currentKitTemplateUUID = uuid;
    }

    @action.bound
    cleanup() {
        this.selectedExamTemplates = [];
        this.setupCurrentKitTemplateUUID("");
        this.examTemplateErrors = [];
    }
}

export const KitTemplateStoreContext = createContext({
    kitTemplateStore: new KitTemplateStore(),
});

interface KitTemplateStoreContextValue {
    kitTemplateStore: KitTemplateStore;
}

export const useKitTemplateStore = (): KitTemplateStoreContextValue => useContext(KitTemplateStoreContext);
