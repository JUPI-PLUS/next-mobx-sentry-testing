// models
import { ServerResponse } from "../../shared/models/axios";
import { ExamTemplateStatusesEnum } from "../../shared/models/business/examTemplate";

export type TemplateTreeNodeChild = Array<TemplatesTreeNode> | null | undefined;
export type DeleteNodeByPath = (path: string) => Promise<void>;

export enum TemplatesTypesEnum {
    GROUP = 1,
    KIT,
    EXAM,
}

export enum DialogTypeEnum {
    GROUP_NAME = 1,
    DELETE,
    ADD,
    MOVE,
}

export interface NodeDetails {
    uuid?: string;
    path?: string;
    name?: string;
    type?: TemplatesTypesEnum;
}

export interface Template {
    item_type: TemplatesTypesEnum;
    uuid: string;
    code: null | string; // can be null if it's folder
    status: null | ExamTemplateStatusesEnum; // can be null if it's folder
    name: string;
    has_child: boolean;
}

export interface TemplateRequestResponse {
    id: number;
    uuid: string;
    parent_uuid: string | null;
    name: string;
}

export interface MoveGroupRequest {
    body: { parent_uuid: string };
    uuid: string;
}

export interface MoveExamKitRequest {
    body: { group_uuid: string };
    uuid: string;
}

export interface TemplateFilters {
    status: number | null;
    name: string | null;
}

export interface TemplatesTreeNode extends Template {
    child?: TemplateTreeNodeChild;
}

export interface TemplatesTreeListProps {
    parentPath?: string;
    containerClassName?: string;
    list: Array<TemplatesTreeNode>;
}

export interface TemplatesTreeNodeProps {
    parentPath: string;
    node: TemplatesTreeNode;
}

export interface TemplatesTreeNodeActionsProps {
    type: TemplatesTypesEnum;
    deleteAllowed: boolean;
    nestedLvl: number;
    fullPath: string;
    uuid: string;
    name: string;
    parentPath: string;
    getDirData: (queryFilters: string) => Promise<ServerResponse<Template[], "common">>;
}

export type TemplatesTreeNodeContentProps = {
    type: TemplatesTypesEnum;
    code: string | null;
    status: ExamTemplateStatusesEnum | null;
};

export type TemplatesTreeNodeStatusesProps = {
    type: TemplatesTypesEnum;
    status: ExamTemplateStatusesEnum | null;
};

export interface FolderActionsProps {
    isOpen: boolean;
    nestedLvl: number;
    onOpen: () => void;
    onClose: () => void;
    onClickAddGroup: () => void;
    onClickAddExam: () => void;
    onClickAddKit: () => void;
}

export interface TemplatesNodeNameProps {
    type: TemplatesTypesEnum;
    isLoading: boolean;
    childVisible: boolean;
    hasChild: boolean;
    nodeName: string;
    fullPath: string;
    onIconClickHandler: () => void;
}

export type TemplatesTreeNodeIconProps = Omit<TemplatesNodeNameProps, "nodeName">;
