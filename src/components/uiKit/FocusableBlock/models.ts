export interface FocusableBlockProps {
    children: JSX.Element | JSX.Element[];
    onClick?: () => void;
    className?: string;
    tabIndex?: number;
    eventKeys?: string[];
}
