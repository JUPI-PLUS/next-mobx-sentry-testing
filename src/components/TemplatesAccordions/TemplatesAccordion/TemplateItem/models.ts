import { MouseEvent } from "react";
import { UrgencyStatus } from "../../../../shared/models/business/enums";
import { ExamTemplateItem } from "../../../../modules/CreateOrder/models";

export type TemplateItemProps = ExamTemplateItem & {
    onStatusClick?: (event: MouseEvent, status: UrgencyStatus) => void;
    isReadOnly?: boolean;
    sampleTypeName?: string;
};
