// models
import { ReferenceValue } from "../../../../../../models";
import { ParameterViewTypeEnum } from "../../../../../../../../shared/models/business/enums";

export interface IntervalsProps {
    referenceValues: ReferenceValue[] | null;
    biologicalReferenceIntervals: string;
    typeViewId: ParameterViewTypeEnum;
    path: string;
}

export interface IntervalsDescriptionsProps {
    groupTitle: string;
    referenceValues: Array<ReferenceValue & { keyId: string }> | null;
}
