export interface PrivateLayoutProps {
    title?: string;
    className?: string;
    containerClassName?: string;
    children: JSX.Element | JSX.Element[];
    redirectTo?: string;
    thin?: boolean;
    overflowHidden?: boolean;
}
