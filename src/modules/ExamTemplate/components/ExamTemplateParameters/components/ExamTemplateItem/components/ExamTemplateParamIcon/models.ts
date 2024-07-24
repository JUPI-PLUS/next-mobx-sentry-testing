// models
import { ExamTemplateParamTypesEnum } from "../../../../models";

export interface ExamTemplateParamIconProps {
    type: ExamTemplateParamTypesEnum;
    detailsOpen: boolean;
    onToggleDetailsOpen: () => void;
    shouldShowChevron?: boolean;
    uuid: string;
}
