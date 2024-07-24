import React, { FC, useMemo } from "react";
import { ExamStatusProps } from "./models";

const ExamStatus: FC<ExamStatusProps> = ({ text, variant }) => {
    const examStatusVariantClassName = useMemo(() => {
        switch (variant) {
            case "success":
                return "text-green-100";
            case "error":
                return "text-red-100";
            default:
                return "text-yellow-100";
        }
    }, [variant]);

    return (
        <span
            className={`flex items-center text-xs font-medium leading-[1.375rem] ${examStatusVariantClassName}`}
            data-testid={`status-${variant}`}
        >
            {text}
        </span>
    );
};

export default ExamStatus;
