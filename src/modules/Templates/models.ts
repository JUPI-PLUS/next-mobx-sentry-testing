// models
import { FormSearchFiledProps } from "../../components/uiKit/SearchField/models";
import { Template, TemplateStatusEnum, TemplateTypeEnum } from "../../shared/models/business/template";

export type DeleteNodeByPath = (path: string) => Promise<void>;

export interface TemplatesSearchInputProps extends FormSearchFiledProps {
    name: keyof TemplateFilters;
    placeholder: string;
    containerClassName?: string;
    autoFocus?: boolean;
    min?: number;
    max?: number;
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
    type?: TemplateTypeEnum;
}

export interface TemplateRequestResponse {
    id: number;
    uuid: string;
    parent_uuid: string | null;
    name: string;
}

export interface MoveGroupRequest {
    body: { parent_uuid: string | null };
    uuid: string;
}

export interface MoveExamKitRequest {
    body: { group_uuid: string | null };
    uuid: string;
}

export interface TemplateFilters {
    status: TemplateStatusEnum | null;
    name: string | null;
}

export interface TemplateItemProps {
    parentPath: string;
    template: Template;
}

export interface TemplateActionsProps {
    template: Template;
    isInsertDisable: boolean;
}

export type TemplateContentProps = {
    type: TemplateTypeEnum;
    code: string | null;
    status: TemplateStatusEnum | null;
};

export type TemplateStatusesProps = {
    type: TemplateTypeEnum;
    status: TemplateStatusEnum | null;
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

export interface TemplateNameCellProps {
    type: TemplateTypeEnum;
    name: string;
    uuid: string;
}

export interface FolderPathProps {
    isFetching: boolean;
    templateParents: Array<Pick<Template, "name" | "uuid">>;
}

export type IconSwitcherProps = Pick<TemplateNameCellProps, "type">;
