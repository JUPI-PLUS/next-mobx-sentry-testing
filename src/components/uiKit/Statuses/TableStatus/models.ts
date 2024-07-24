export type TableStatusVariant = "error" | "success" | "warning" | "primary" | "neutral";

export interface TableStatusProps {
    text: string;
    variant?: TableStatusVariant;
}
