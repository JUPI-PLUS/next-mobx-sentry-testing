import React, { FC, useMemo } from "react";
import { TableStatusProps } from "./models";

const TableStatus: FC<TableStatusProps> = ({ text, variant }) => {
    const tableStatusVariantClassName = useMemo(() => {
        switch (variant) {
            case "success":
                return "before:bg-green-100";
            case "neutral":
                return "before:bg-dark-500";
            case "warning":
                return "before:bg-yellow-100";
            case "error":
                return "before:bg-red-100";
            default:
                return "before:bg-brand-100";
        }
    }, [variant]);

    return (
        <span
            className={`flex items-center text-base leading-[1.125rem] before:inline-block before:rounded-full ${tableStatusVariantClassName} before:w-2 before:h-2 before:mr-2`}
            data-testid={`table-status-${variant}`}
        >
            {text}
        </span>
    );
};

export default TableStatus;
