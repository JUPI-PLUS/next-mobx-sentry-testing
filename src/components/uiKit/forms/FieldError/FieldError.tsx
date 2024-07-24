import React, { FC } from "react";
import { FieldErrorProps } from "./models";

const FieldError: FC<FieldErrorProps> = ({ message, name = "", className = "" }) => (
    <div data-testid={`field-${name}-error-container`} className={`flex items-start text-xs mt-1 ${className}`}>
        <p className="text-red-100">{message}</p>
    </div>
);

export default React.memo(FieldError);
