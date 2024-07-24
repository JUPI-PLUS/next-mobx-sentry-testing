import { action, makeObservable, observable } from "mobx";
import { computedFn } from "mobx-utils";
import { createContext, useContext } from "react";
import { Lookup } from "../../shared/models/form";
import { ID } from "../../shared/models/common";
import { UrgencyTypesDictionaryItem } from "../../shared/models/dictionaries";

export class TemplatesAccordionsStore {
    @observable public autoExpandedTemplateAccordion = "";
    @observable public expandedByUserTemplatesAccordions: Array<string> = [];
    @observable public urgencyTypes: Array<Lookup<ID>> = [];
    @observable public examSampleTypes: Array<Lookup<ID>> = [];

    constructor() {
        makeObservable(this);
    }

    @action.bound
    setupAutoExpandedTemplateAccordion(uuid: string) {
        this.autoExpandedTemplateAccordion = uuid;
    }

    @action.bound
    setupExpandedByUserTemplatesAccordions(uuid: string) {
        const isAutoExpanded = this.autoExpandedTemplateAccordion === uuid;
        const isAlreadyExpandedByUser = this.expandedByUserTemplatesAccordions.includes(uuid);

        if (!isAlreadyExpandedByUser) {
            if (isAutoExpanded) {
                this.setupAutoExpandedTemplateAccordion("");
            } else {
                this.expandedByUserTemplatesAccordions.push(uuid);
            }
        } else {
            this.expandedByUserTemplatesAccordions = this.expandedByUserTemplatesAccordions.filter(
                accordionUUID => accordionUUID !== uuid
            );
        }
    }

    @action.bound
    setupUrgencyTypesLookups(lookups: (Lookup<ID> & Partial<UrgencyTypesDictionaryItem>)[]) {
        this.urgencyTypes = lookups;
    }

    @action.bound
    setupExamSampleTypes(lookup: Array<Lookup<ID>>) {
        this.examSampleTypes = lookup;
    }

    @action.bound
    cleanup() {
        this.autoExpandedTemplateAccordion = "";
        this.expandedByUserTemplatesAccordions = [];
    }

    isTemplateAccordionActive = computedFn((uuid: string) => {
        return [this.autoExpandedTemplateAccordion, ...this.expandedByUserTemplatesAccordions].includes(uuid);
    });
}

export const TemplatesAccordionsStoreContext = createContext({
    templatesAccordionsStore: new TemplatesAccordionsStore(),
});

interface TemplatesAccordionsStoreContextValue {
    templatesAccordionsStore: TemplatesAccordionsStore;
}

export const useTemplatesAccordionsStore = (): TemplatesAccordionsStoreContextValue =>
    useContext(TemplatesAccordionsStoreContext);
