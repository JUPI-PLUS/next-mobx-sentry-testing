import { Placement } from "@popperjs/core";
import { ID } from "../../../shared/models/common";
import { Lookup } from "../../../shared/models/form";

export interface LookupListProps<LookupItemType = ID, LookupType = Lookup<LookupItemType>> {
    lookups: LookupType[];
    matchField: keyof LookupType | (keyof LookupType)[];
    selectedLookups: LookupType[];
    children: JSX.Element;
    offsetDistance?: number;
    placeholder?: string;
    offsetSkidding?: number;
    placement?: Placement;
    className?: string;
    disabled?: boolean;
    onReset: () => void;
    onSubmit: (pickedItems: LookupType[]) => void;
}
