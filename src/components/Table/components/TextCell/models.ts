type PopperSize = "xs" | "sm" | "md" | "lg";
type TextSize = "xs" | "sm" | "md" | "lg";

export interface TextCellProps {
    popperSize?: PopperSize;
    textSize?: TextSize;
    text: string;
}
