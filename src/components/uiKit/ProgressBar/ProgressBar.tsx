// libs
import { FC } from "react";

// models
import { ProgressBarProps } from "./models";

const ProgressBar: FC<ProgressBarProps> = ({ children, className = "", ...rest }) => {
    return (
        <div
            className={`h-1 first:rounded-l-sm last:rounded-r-sm w-full  ${children ? "relative" : ""} ${className}`}
            data-testid="progress-bar"
            {...rest}
        >
            {children}
        </div>
    );
};

export default ProgressBar;
