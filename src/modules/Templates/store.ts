import { action, computed, makeObservable, observable } from "mobx";
import { stringify } from "query-string";
import { createContext, useContext } from "react";
import { Template, TemplateTypeEnum } from "../../shared/models/business/template";
import { DEFAULT_TEMPLATES_FILTER_VALUES } from "./constants";
import { DialogTypeEnum, TemplateFilters } from "./models";

export class TemplatesStore {
    @observable public copiedExamTemplateUUID = "";
    @observable public copiedKitTemplateUUID = "";
    @observable public nestedLvl = 0;
    @observable public parentGroupUUID: string | null = null; //null it's root parentGroupUuid
    @observable public currentFolderUUID: string | null = null; //null it's root currentFolderUUID
    @observable public isMoveInFolderAction = false;
    @observable public resetCounter = 0;
    @observable private _cutItemDetails: Template | null = null; //details of moving Template/Folder
    @observable private _dialogType: DialogTypeEnum | null = null;
    @observable private _itemDetails: Partial<Template> = {};
    @observable private _templatesFilters: TemplateFilters = DEFAULT_TEMPLATES_FILTER_VALUES;

    constructor() {
        makeObservable(this);
    }

    @action.bound
    setupCopiedTemplate(templateType: TemplateTypeEnum, templateUUID = "") {
        switch (templateType) {
            case TemplateTypeEnum.EXAM:
                this.copiedExamTemplateUUID = templateUUID;
                return;
            case TemplateTypeEnum.KIT:
                this.copiedKitTemplateUUID = templateUUID;
                return;
        }
    }

    @action.bound
    setupParentGroupUUID(uuid: string | null) {
        this.parentGroupUUID = uuid;
    }

    @action.bound
    setupCurrentFolderUUID(uuid: string | null) {
        this.currentFolderUUID = uuid;
    }

    @action.bound
    setupCopiedKitTemplateUUID(uuid: string) {
        this.copiedKitTemplateUUID = uuid;
    }

    @action.bound
    setupCopiedExamTemplateUUID(uuid: string) {
        this.copiedExamTemplateUUID = uuid;
    }

    @action.bound
    setupNestedLvl(nestedLvl: number) {
        this.nestedLvl = nestedLvl;
    }

    @action.bound
    private _cleanupListSettings() {
        this.cleanupTemplatesFilters();
        this.isMoveInFolderAction = false;
        this.nestedLvl = 0;
        this.cleanupUpdatingPositionTemplate();
        this.setDialogType(null);
        this.setTemplateDetails({});
    }

    @action.bound
    cleanup() {
        this._cleanupListSettings();
    }

    @action.bound
    cleanupExamTemplate() {
        this.copiedExamTemplateUUID = "";
        this.cleanupParentGroupUUID();
        this.cleanupCurrentFolderUUID();
        this._cleanupListSettings();
    }

    @action.bound
    cleanupKitTemplate() {
        this.copiedKitTemplateUUID = "";
        this.cleanupParentGroupUUID();
        this.cleanupCurrentFolderUUID();
        this._cleanupListSettings();
    }

    @action.bound
    cleanupParentGroupUUID() {
        this.parentGroupUUID = null;
    }

    @action.bound
    cleanupCurrentFolderUUID() {
        this.currentFolderUUID = null;
    }

    @action.bound
    setTemplateDetails(details: Partial<Template>) {
        this._itemDetails = details;
    }

    @action.bound
    setUpdatingPositionTemplate(template: Template) {
        this._cutItemDetails = template;
    }

    @action.bound
    cleanupUpdatingPositionTemplate() {
        this._cutItemDetails = null;
    }

    @action.bound
    setDialogType(type: DialogTypeEnum | null) {
        this._dialogType = type;
    }

    @action.bound
    onCloseDialog() {
        this.setDialogType(null);
        this.setTemplateDetails({});
    }

    @action.bound
    setTemplatesFilterValue(name: keyof TemplateFilters, value: string | number | null) {
        switch (name) {
            case "name":
                this._templatesFilters[name] = value as string | null;
                return;
            case "status":
                this._templatesFilters[name] = value as number | null;
                return;
        }
    }

    @action.bound
    cleanupTemplatesFilters() {
        this._templatesFilters = DEFAULT_TEMPLATES_FILTER_VALUES;
    }

    @action.bound
    setupIsMoveToFolder(isMoving: boolean) {
        this.isMoveInFolderAction = isMoving;
    }

    @action.bound
    addResetCount() {
        this.resetCounter += 1;
    }

    @computed get templatesFilters() {
        return this._templatesFilters;
    }

    @computed get cutItemDetails() {
        return this._cutItemDetails;
    }

    @computed get dialogType() {
        return this._dialogType;
    }

    @computed get itemDetails() {
        return this._itemDetails;
    }

    @computed get templatesFiltersQueryString() {
        return stringify(this._templatesFilters, { skipEmptyString: true, skipNull: true });
    }

    @computed get templatesFolderQueryString() {
        return stringify({ folder: this.currentFolderUUID }, { skipEmptyString: true, skipNull: true });
    }

    @action.bound
    getTemplatesQuery(groupUuid?: string | string[] | null) {
        if (this.isMoveInFolderAction || (!this.templatesFiltersQueryString && groupUuid !== null)) {
            return stringify(
                { group_uuid: this.isMoveInFolderAction ? groupUuid : groupUuid || this.parentGroupUUID },
                {
                    skipEmptyString: true,
                    skipNull: true,
                }
            );
        }
        return this.templatesFiltersQueryString;
    }
}

export const TemplatesStoreContext = createContext({
    templatesStore: new TemplatesStore(),
});

interface TemplatesStoreContextValue {
    templatesStore: TemplatesStore;
}

export const useTemplatesStore = (): TemplatesStoreContextValue => useContext(TemplatesStoreContext);
