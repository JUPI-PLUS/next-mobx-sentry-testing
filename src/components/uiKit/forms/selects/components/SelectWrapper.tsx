import React, { FC } from "react";

interface SelectWrapperProps {
    isError?: boolean;
    className?: string;
    children?: JSX.Element | JSX.Element[];
}

const SelectWrapper: FC<SelectWrapperProps> = ({ isError = false, className = "", children }) => {
    return <div className={`select flex flex-col ${isError ? "has-error" : ""} ${className}`}>{children}</div>;
};

export default SelectWrapper;
