// libs
import { createContext, useContext } from "react";
import { action, computed, makeObservable, observable } from "mobx";
import { uniqueId } from "lodash";

// helpers
import {
    addParameterInGroup,
    addParameterInSource,
    deleteParameterInGroup,
    deleteParameterInSource,
    editParameterInGroup,
    editParameterInSource,
} from "./helpers";

// models
import { Lookup } from "../../shared/models/form";
import { ID } from "../../shared/models/common";
import { ExamTemplateItemWithId } from "./components/ExamTemplateParameters/models";
import { ExamInfoFormFields } from "./components/ExamTemplateGeneralInfo/models";
import { AddEditParamToExamTemplate } from "../../shared/models/business/examTemplate";
import { Parameter } from "../../shared/models/business/parameter";

// constants
import { DEFAULT_EXAM_TEMPLATE_GROUP } from "./constants";

interface ExamTemplateDictionaries {
    sampleTypesLookup: Lookup<ID>[];
    measurementUnitsLookup: Lookup<ID>[];
    examTemplateStatusesLookup: Lookup<ID>[];
}

export interface SelectedExamTemplateItem {
    item: Parameter | null;
    parentUUID: string;
}

export interface SelectedExamTemplateGroup {
    group_name: string;
    group_uuid: string;
}

export enum ActionDialogType {
    ADD_GROUP = "add-group",
    ADD_PARAMETER = "add-parameter",
    EDIT_GROUP = "edit-group",
    EDIT_PARAMETER = "edit-parameter",
    DELETE_GROUP = "delete-group",
    DELETE_PARAMETER = "delete-parameter",
}

class ExamTemplateStore {
    @observable private _step = 0;
    @observable private _actionType: ActionDialogType | null = null;
    @observable private _examTemplateUUID = "";
    @observable private _selectedItem: SelectedExamTemplateItem = { item: null, parentUUID: "" };
    @observable private _selectedGroup: SelectedExamTemplateGroup | null = null;
    @observable private _examTemplateInfo: ExamInfoFormFields | null = null;
    @observable private _examTemplateParameters: ExamTemplateItemWithId[] = [];
    @observable private _examTemplateGroupParamsMap: Map<string, string> = new Map();
    @observable private _examTemplateDictionaries: ExamTemplateDictionaries = {
        sampleTypesLookup: [],
        measurementUnitsLookup: [],
        examTemplateStatusesLookup: [],
    };

    constructor() {
        makeObservable(this);
    }

    @action.bound
    goToNextStep() {
        this._step += 1;
    }

    @action.bound
    goToPrevStep() {
        this._step -= 1;
    }

    @action.bound
    setupExamTemplateInfo(data: ExamInfoFormFields) {
        this._examTemplateInfo = data;
    }

    @action.bound
    setupExamTemplateParameters(parameters: AddEditParamToExamTemplate[]) {
        this._examTemplateParameters = parameters.map(param => ({ id: uniqueId("group"), ...param }));

        const groupParamsMap = new Map<string, string>();
        parameters.forEach(({ group_uuid, params }) => {
            if (!params?.length) return;
            params.forEach(({ uuid }) => {
                groupParamsMap.set(uuid, group_uuid || "");
            });
        });

        this._examTemplateGroupParamsMap = groupParamsMap;
    }

    @action.bound
    setupExamTemplateDictionaries(dictionaries: ExamTemplateDictionaries) {
        this._examTemplateDictionaries = dictionaries;
    }

    @action.bound
    setupExamTemplateUUID(uuid: string) {
        this._examTemplateUUID = uuid;
    }

    @action.bound
    setActionType(type: ActionDialogType) {
        this._actionType = type;
    }

    @action.bound
    clearActionType() {
        this._actionType = null;
        this._selectedItem = { item: null, parentUUID: "" };
        this._selectedGroup = null;
    }

    @action.bound
    setSelectedItem(item: Parameter, parentUUID = "") {
        this._selectedItem = { item, parentUUID };
    }

    @action.bound
    setSelectedGroup(groupData: SelectedExamTemplateGroup) {
        this._selectedGroup = groupData;
    }

    @action.bound
    addGroup(groupData: AddEditParamToExamTemplate) {
        this._examTemplateParameters = [
            ...this.examTemplateParameters,
            {
                ...DEFAULT_EXAM_TEMPLATE_GROUP,
                ...groupData,
                id: uniqueId("group"),
            },
        ];
        this.clearActionType();
    }

    @action.bound
    editGroup(groupData: AddEditParamToExamTemplate) {
        this._examTemplateParameters = this.examTemplateParameters.map(p =>
            p.group_uuid === groupData.group_uuid ? { ...p, group_name: groupData.group_name } : p
        );
        this.clearActionType();
    }

    @action.bound
    deleteGroup() {
        this._examTemplateParameters = this.examTemplateParameters.filter(
            p => p.group_uuid !== this.selectedGroup?.group_uuid
        );
        this.clearActionType();
    }

    @action.bound
    addParameter(parameterData: Parameter) {
        if (this.selectedGroup) {
            this._examTemplateParameters = addParameterInGroup(
                this.examTemplateParameters,
                this.selectedGroup.group_uuid,
                parameterData
            );
            this._examTemplateGroupParamsMap.set(parameterData.uuid, this.selectedGroup.group_uuid);
        } else {
            this._examTemplateParameters = addParameterInSource(this.examTemplateParameters, parameterData);
            this._examTemplateGroupParamsMap.set(parameterData.uuid, "");
        }
        this.clearActionType();
    }

    @action.bound
    editParameter(parameterData: Parameter) {
        if (this.selectedItem.parentUUID) {
            this._examTemplateParameters = editParameterInGroup(
                this.examTemplateParameters,
                this.selectedItem.parentUUID,
                parameterData
            );
        } else {
            this._examTemplateParameters = editParameterInSource(this.examTemplateParameters, parameterData);
        }
    }

    @action.bound
    deleteParameter() {
        if (this.selectedItem.parentUUID) {
            this._examTemplateParameters = deleteParameterInGroup(
                this.examTemplateParameters,
                this.selectedItem.parentUUID,
                this.selectedItem.item?.uuid || ""
            );
        } else {
            this._examTemplateParameters = deleteParameterInSource(
                this.examTemplateParameters,
                this.selectedItem.parentUUID,
                this.selectedItem.item?.uuid || ""
            );
        }
        this._examTemplateGroupParamsMap.delete(this.selectedItem.item?.uuid || "");
        this.clearActionType();
    }

    @action.bound
    cleanup() {
        this._step = 0;
        this._examTemplateUUID = "";
        this._examTemplateInfo = null;
        this._examTemplateParameters = [];
        this._actionType = null;
        this._selectedItem = { item: null, parentUUID: "" };
        this._selectedGroup = null;
        this._examTemplateGroupParamsMap = new Map();
    }

    @computed
    get activeStep() {
        return this._step;
    }

    @computed
    get examTemplateInfo() {
        return this._examTemplateInfo;
    }

    @computed
    get examTemplateParameters() {
        return this._examTemplateParameters;
    }

    @computed
    get examTemplateParamsUUIDFromMap() {
        return Array.from(this._examTemplateGroupParamsMap.keys());
    }

    @computed
    get examTemplateParamsRelations() {
        return Array.from(this._examTemplateGroupParamsMap.entries()).map(([param_uuid, group_uuid]) => ({
            param_uuid,
            group_uuid,
        }));
    }

    @computed
    get examTemplateDictionaries() {
        return this._examTemplateDictionaries;
    }

    @computed
    get examTemplateUUID() {
        return this._examTemplateUUID;
    }

    @computed
    get selectedItem() {
        return this._selectedItem;
    }

    @computed
    get selectedGroup() {
        return this._selectedGroup;
    }

    @computed
    get actionType() {
        return this._actionType;
    }

    @computed
    get dialogTitle() {
        if (!this._actionType) return "";
        switch (this._actionType) {
            case ActionDialogType.ADD_GROUP:
                return "New group";
            case ActionDialogType.EDIT_GROUP:
                return "Edit group";
            case ActionDialogType.DELETE_GROUP:
                return `Delete group`;
            case ActionDialogType.DELETE_PARAMETER:
                return `Delete parameter`;
            default:
                return "";
        }
    }

    @computed
    get isAddEditGroupDialogOpen() {
        return this._actionType === ActionDialogType.ADD_GROUP || this._actionType === ActionDialogType.EDIT_GROUP;
    }

    @computed
    get isAddParameterDrawerOpen() {
        return this._actionType === ActionDialogType.ADD_PARAMETER;
    }

    @computed
    get isEditParameterDrawerOpen() {
        return this._actionType === ActionDialogType.EDIT_PARAMETER;
    }

    @computed
    get isDeleteDialogOpen() {
        return (
            this._actionType === ActionDialogType.DELETE_GROUP || this._actionType === ActionDialogType.DELETE_PARAMETER
        );
    }
}

export const examTemplateStoreContext = createContext({
    examTemplateStore: new ExamTemplateStore(),
});

interface ExamTemplateStoreContextValue {
    examTemplateStore: ExamTemplateStore;
}

export const useExamTemplateStore = (): ExamTemplateStoreContextValue => useContext(examTemplateStoreContext);
