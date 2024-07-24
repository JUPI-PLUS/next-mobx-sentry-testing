// models
import { ParameterViewTypeEnum } from "../../../../../../../../shared/models/business/enums";
import { Lookup } from "../../../../../../../../shared/models/form";
import { ID } from "../../../../../../../../shared/models/common";
import { ReferenceValue } from "../../../../../../models";
import { DisabledOption } from "../../../../../../../../components/uiKit/forms/selects/Select/models";
import { ExamStatusesEnum } from "../../../../../../../../shared/models/business/exam";

export interface ValueInputProps {
    path: string;
    uuid: string;
    value?: Array<string> | string | null;
    disabled?: boolean;
    examStatus: ExamStatusesEnum;
    options: Lookup<ID>[] | DisabledOption<Lookup<ID>>[];
    referenceValues: ReferenceValue[] | null;
    typeViewId: ParameterViewTypeEnum;
}
