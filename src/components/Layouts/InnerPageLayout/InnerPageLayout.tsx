import React, { FC } from "react";
import { InnerPageLayoutProps } from "./models";

const InnerPageLayout: FC<InnerPageLayoutProps> = ({ className = "", children }) => {
    return <div className={`grid grid-rows-innerPageLayout overflow-y-auto ${className}`}>{children}</div>;
};

export default InnerPageLayout;
