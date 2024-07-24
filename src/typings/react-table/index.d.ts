import "@tanstack/react-table";

declare module "@tanstack/react-table" {
    interface ColumnDefBase {
        className?: string;
        isTruncated?: boolean;
    }
}
