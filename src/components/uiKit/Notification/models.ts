export type NotificationVariant = "info" | "error" | "warning" | "success";

export interface NotificationProps {
    variant?: NotificationVariant;
    text?: string;
    icon?: JSX.Element;
    children?: JSX.Element;
}
