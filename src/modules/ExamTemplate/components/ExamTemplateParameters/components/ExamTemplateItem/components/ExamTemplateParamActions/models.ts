// models
import { ExamTemplateParamTypesEnum } from "../../../../models";
import { ActionDialogType } from "../../../../../../store";

export interface ExamTemplateParamActionsProps {
    setSelectedItem: () => void;
    setActionType: (type: ActionDialogType) => void;
    type: ExamTemplateParamTypesEnum;
    shouldShowDeleteIcon?: boolean;
    uuid: string;
}
