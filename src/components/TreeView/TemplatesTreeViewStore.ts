// libs
import { createContext, useContext } from "react";
import { action, computed, makeObservable, observable } from "mobx";
import { stringify } from "query-string";

// helpers
import { cutByPath, deleteByPath, findLinkByPath } from "./utils";
import { showErrorToast } from "../uiKit/Toast/helpers";

// models
import {
    TemplatesTreeNode,
    Template,
    TemplatesTypesEnum,
    TemplateFilters,
    DialogTypeEnum,
    NodeDetails,
} from "./models";
import { ID } from "../../shared/models/common";
import { DEFAULT_TEMPLATES_FILTER_VALUES } from "./constants";

export class TemplatesTreeViewStore {
    @observable private _treeView: Array<TemplatesTreeNode> = [];
    @observable public updatingNodePositionPath: string | null = null;
    @observable private _selectedNodes: Array<ID> = [];
    @observable public dialogType: DialogTypeEnum | null = null;
    @observable private _templatesFilters: TemplateFilters = DEFAULT_TEMPLATES_FILTER_VALUES;
    @observable public nodeDetails: NodeDetails = {};
    // if dialogType is ADD, nodeDetails is details of parent node, if dialogType is MOVE, nodeDetails is details of element moving to

    constructor() {
        makeObservable(this);
    }

    @action.bound
    cleanup() {
        this._treeView = [];
        this._selectedNodes = [];
        this.dialogType = null;
        this.nodeDetails = {};
        this.resetNodePositionPath();
        this.resetTemplatesFilter();
    }

    @action.bound
    setTreeView(treeView: Array<Template>) {
        this._treeView = treeView.map(template => {
            if (template.item_type !== TemplatesTypesEnum.GROUP) return template;

            return { ...template, child: template.has_child ? [] : undefined };
        });
    }

    @action.bound
    setTreeViewRootItem(template: Template) {
        this._treeView.unshift({ ...template, child: template.has_child ? [] : undefined });
    }

    @action.bound
    setTreeViewChildData(childData: Array<Template>, parentPath: string) {
        const parentNode = findLinkByPath(this._treeView!, parentPath)!;
        parentNode.child = childData.map(template => {
            if (template.item_type !== TemplatesTypesEnum.GROUP) return template;

            return { ...template, child: template.has_child ? [] : undefined };
        });
    }

    @action.bound
    updateTreeNodeName(path: string, newName: string) {
        const finedLink = findLinkByPath(this._treeView!, path);
        finedLink.name = newName;
    }

    @action.bound
    deleteNodeByPath(path: string) {
        deleteByPath(this._treeView!, path);
    }

    @action.bound
    setSelectedNode(uuid: string) {
        this._selectedNodes.push(uuid);
    }

    @action.bound
    removeSelectedNodes(uuid: string) {
        const index = this._selectedNodes.findIndex(selectedId => selectedId === uuid);
        this._selectedNodes.splice(index, 1);
    }

    @action.bound
    copyPositionNodePath(path: string) {
        this.updatingNodePositionPath = path;
    }

    @action.bound
    resetNodePositionPath() {
        this.updatingNodePositionPath = null;
    }

    @action.bound
    insertPositionNodePath() {
        const nodeCopy = cutByPath(this._treeView, this.updatingNodePositionPath!);
        if (!nodeCopy) {
            showErrorToast({ title: "Node path not found" });
        }
        this.resetNodePositionPath();
    }

    @action.bound
    setDialogType(type: DialogTypeEnum | null) {
        this.dialogType = type;
    }

    @action.bound
    onCloseDialog() {
        this.setDialogType(null);
        this.setNodeDetails({});
    }

    @action.bound
    setNodeDetails(details: NodeDetails) {
        this.nodeDetails = details;
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
    resetTemplatesFilter() {
        this._templatesFilters = DEFAULT_TEMPLATES_FILTER_VALUES;
    }

    @computed get treeStructure() {
        return this._treeView;
    }

    @computed get updatingNodePositionParentPath() {
        return this.updatingNodePositionPath
            ? this.updatingNodePositionPath.substring(0, this.updatingNodePositionPath.lastIndexOf("."))
            : "";
    }

    @computed get selectedNodesArray() {
        return this._selectedNodes;
    }

    @computed get templatesFilters() {
        return this._templatesFilters;
    }

    @computed get templatesFiltersQueryString() {
        return stringify(this._templatesFilters, { skipEmptyString: true, skipNull: true });
    }

    @computed get isNodePositionUpdating() {
        return Boolean(this.updatingNodePositionPath);
    }

    @computed get updatingNodePositionType() {
        if (!this.isNodePositionUpdating) return;

        return findLinkByPath(this._treeView, this.updatingNodePositionPath!)?.item_type;
    }

    public isNodeSelected(nodeId: ID): boolean {
        return this._selectedNodes.includes(nodeId);
    }
}

// CONTEXT
export const store = new TemplatesTreeViewStore();

export const TemplatesTreeViewContext = createContext(store);

export const useTemplatesTreeViewStore = () => useContext(TemplatesTreeViewContext);
