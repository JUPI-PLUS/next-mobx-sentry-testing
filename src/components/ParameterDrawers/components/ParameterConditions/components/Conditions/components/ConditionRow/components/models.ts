import { Lookup } from "../../../../../../../../../shared/models/form";
import { ID } from "../../../../../../../../../shared/models/common";

export interface ConditionRowValueControlProps {
    label?: string;
    pickedValue?: Lookup<ID> & { alias: string | null };
    conditionGroupIndex: number;
    conditionRowIndex: number;
}
