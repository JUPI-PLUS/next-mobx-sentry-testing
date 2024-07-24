import { Lookup } from "../../../../../../../../shared/models/form";
import { ID } from "../../../../../../../../shared/models/common";

export interface ColorCellProps {
    conditionGroupIndex: number;
    rowIndex: number;
}

export interface ColorCircleProps {
    color: string;
    onChange: () => void;
    isActive: boolean;
}

export interface ColorPickerProps {
    colors: Lookup<ID>[];
    selectedColorId: ID;
    onColorChange: (value: ID) => void;
}
