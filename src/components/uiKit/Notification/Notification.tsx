// libs
import React, { FC, useMemo } from "react";

// models
import { NotificationProps } from "./models";

// components
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const Notification: FC<NotificationProps> = ({ variant = "info", text, icon, children }) => {
    const notificationVariantClassNames = useMemo(() => {
        switch (variant) {
            case "success":
                return "bg-green-50 text-green-600";
            case "error":
                return "bg-red-50 text-red-600";
            case "warning":
                return "bg-yellow-50 text-yellow-600";
            default:
                return "bg-blue-50 text-blue-600";
        }
    }, [variant]);

    return (
        <div
            className={`${notificationVariantClassNames} rounded-md text-sm px-4 py-2 flex`}
            data-testid={`notification-${variant}`}
        >
            {icon || (
                <ExclamationCircleIcon data-testid="notification-default-icon" className="w-10 h-7 mr-2 text-red-100" />
            )}
            {children || text}
        </div>
    );
};

export default Notification;
