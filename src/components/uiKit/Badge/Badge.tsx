import React, { FC, useMemo } from "react";
import { BadgeProps } from "./models";

const Badge: FC<BadgeProps> = ({ variant = "info", text, ...rest }) => {
    const badgeColor = useMemo(() => {
        switch (variant) {
            case "error":
                return "bg-red-100 text-white";
            case "warning":
                return "bg-yellow-100 text-white";
            case "neutral":
                return "bg-dark-500 text-white";
            case "success":
                return "bg-green-100 text-white";
            default:
                return "bg-brand-100 text-white";
        }
    }, [variant]);

    return (
        <div
            className={`py-0.5 px-1.5 text-xs rounded uppercase inline ${badgeColor}`}
            data-testid={`badge-${variant}-${text}`}
            {...rest}
        >
            {text}
        </div>
    );
};

export default Badge;
