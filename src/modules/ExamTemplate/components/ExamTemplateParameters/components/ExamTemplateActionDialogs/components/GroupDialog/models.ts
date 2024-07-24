// models
import { AddEditParamToExamTemplate } from "../../../../../../../../shared/models/business/examTemplate";
import { SelectedExamTemplateGroup } from "../../../../../../store";

export interface GroupDialogProps {
    isOpen: boolean;
    onClose: () => void;
    dialogTitle: string;
    selectedGroup: SelectedExamTemplateGroup | null;
    onAddGroup: (groupData: AddEditParamToExamTemplate) => void;
    onEditGroup: (groupData: AddEditParamToExamTemplate) => void;
    examTemplateUUID: string;
}

export interface ParamsGroupMutationData {
    name: string;
    exam_template_uuid: string;
}

export type ParamsGroupMutationResponse = ParamsGroupMutationData & {
    uuid: string;
};
