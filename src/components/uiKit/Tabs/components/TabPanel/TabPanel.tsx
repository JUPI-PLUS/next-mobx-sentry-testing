import React, { FC } from "react";
import { TabPanelProps } from "./models";

const TabPanel: FC<TabPanelProps> = ({ children, className }) => {
    return <div className={className}>{children}</div>;
};

TabPanel.displayName = "TabPanel";

export default TabPanel;
