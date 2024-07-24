// libs
import { createContext, useContext } from "react";
import { action, makeObservable, observable } from "mobx";

// models
import { ExamTemplate } from "../../shared/models/business/exam";
import { Lookup } from "../../shared/models/form";
import { ID } from "../../shared/models/common";
import { ExamTemplateError } from "./models";

export class WorkplaceStore {
    @observable public selectedExamTemplates: ExamTemplate[] = [];
    @observable public examTemplateErrors: ExamTemplateError[] = [];
    @observable public examTemplateStatusesLookup: Lookup<ID>[] = [];

    constructor() {
        makeObservable(this);
    }

    @action.bound
    setupExamTemplateErrors(errors: ExamTemplateError[]) {
        this.examTemplateErrors = errors;
    }

    @action.bound
    removeExamTemplateErrors(index: number) {
        this.examTemplateErrors = this.examTemplateErrors.filter((temp, curIndex) => curIndex !== index);
    }

    @action.bound
    setupExamTemplateStatusesLookup(statuses: Lookup<ID>[]) {
        this.examTemplateStatusesLookup = statuses;
    }

    @action.bound
    setupSelectedExamTemplates(examTemplates: ExamTemplate[]) {
        this.selectedExamTemplates = [...this.selectedExamTemplates, ...examTemplates];
    }

    @action.bound
    removeExamTemplate(index: number) {
        this.selectedExamTemplates = this.selectedExamTemplates.filter((temp, curIndex) => curIndex !== index);
    }

    @action.bound
    cleanup() {
        this.selectedExamTemplates = [];
        this.examTemplateErrors = [];
    }
}

export const WorkplaceStoreContext = createContext({
    workplaceStore: new WorkplaceStore(),
});

interface WorkplaceStoreContextValue {
    workplaceStore: WorkplaceStore;
}

export const useWorkplaceStore = (): WorkplaceStoreContextValue => useContext(WorkplaceStoreContext);
