import { FC } from "react";
import { TabPanelsProps } from "./models";

const TabPanels: FC<TabPanelsProps> = ({ children, activeIndex }) => {
    if (activeIndex < 0) return null;
    const nextChildren = Array.isArray(children) ? children[activeIndex >= 0 ? activeIndex : 0] : children;

    if (nextChildren?.type?.displayName !== "TabPanel") {
        // eslint-disable-next-line no-console
        console.error("Tab content should be wrapped by TabPanel component!");
        return null;
    }

    return nextChildren;
};

export default TabPanels;
