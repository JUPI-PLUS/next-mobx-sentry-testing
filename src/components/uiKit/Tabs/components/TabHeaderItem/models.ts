export interface TabHeaderItemProps {
    isDisabled?: boolean;
    isActive: boolean;
    label: string;
    name?: string | number;
    icon?: JSX.Element;
    isParentScrollable?: boolean;
}
