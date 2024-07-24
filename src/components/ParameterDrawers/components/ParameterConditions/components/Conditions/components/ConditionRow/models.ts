export interface ConditionRowProps {
    id: string;
    isOne: boolean;
    isFirst: boolean;
    isDefault?: boolean;
    onDelete: (id: string) => void;
    conditionGroupIndex: number;
    rowIndex: number;
}
